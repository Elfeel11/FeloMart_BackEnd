import z from "zod";

export const commonValidationFields = {
  userName: z
    .string()
    .min(3, { error: "Username cannot be less than 3 char" })
    .max(20, { error: "Username cannot be greater than 20 char" }),
  password: z
    .string()
    .regex(
      new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}/),
    ),
  email: z.email(),
  age: z.number().positive(),
  //   gender: z.enum(GenderEnum),
  phone: z.string().regex(new RegExp(/^(\+201|00201|01)(0|1|2|5)\d{8}$/)),
  otp: z.string().regex(new RegExp(/\d{6}/)),
  //   id: z
  //     .string()
  //     .refine((value) => Types.ObjectId.isValid(value), 'invalid objectId'),
};

export const loginSchema = {
  body: z.strictObject({
    email: commonValidationFields.email,
    password: commonValidationFields.password,
    FCM: z.string().optional(),
  }),
};

export const signupSchema = {
  body: loginSchema.body
    .extend({
      userName: commonValidationFields.userName,
      confirmPassword: z.string(),
      age: commonValidationFields.age.optional(),
      //   gender: commonValidationFields.gender.optional(),
      phone: commonValidationFields.phone.optional(),
    })
    .refine(
      (data) => {
        return data.confirmPassword === data.password;
      },
      {
        error: "confirm password doesn't match password",
      },
    ),
};
