import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "src/common/enums/user.enums";
import { SecurityModule } from "../common/module/security/security.module.js";
import { SecurityService } from "../common/module/security/security.service.js";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  provider: ProviderEnum;
  confirmEmail: boolean;
  profilePic: string;
  coverPics: string[];
  age: number;
  phone: string;
  gender: GenderEnum;
  role: RoleEnum;
  changeCreditTime: Date;
  deletedAt: Date;
}

export type IHUser = HydratedDocument<IUser>;
@Schema({
  timestamps: true,
  strictQuery: true,
})
export class User {
  @Prop({ type: String, required: true })
  userName!: string;

  @Prop({ type: String, required: true })
  email!: string;

  @Prop({
    type: String,
    required: function (this: IHUser): boolean {
      return this.provider == ProviderEnum.System;
    },
  })
  password!: string;

  @Prop({
    type: Number,
    enum: ProviderEnum,
    default: ProviderEnum.System,
  })
  provider!: ProviderEnum;
  @Prop({ type: Boolean, default: false })
  confirmEmail!: boolean;

  @Prop(String)
  profilePic!: string;

  @Prop([String])
  coverPics!: string[];

  @Prop(Number)
  age!: number;

  @Prop(String)
  phone!: string;

  @Prop({ type: Number, enum: GenderEnum, default: GenderEnum.Male })
  gender!: GenderEnum;

  @Prop({ type: Number, enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;

  @Prop(Date)
  changeCreditTime!: Date;
  @Prop(Date)
  deletedAt!: Date;
}

const userSchema = SchemaFactory.createForClass(User);

// const userModel = MongooseModule.forFeature([
//   { name: User.name, schema: userSchema },
// ]);
const userModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory(securityService: SecurityService) {
      userSchema.pre(
        "save",
        async function (this: IHUser & { wasNew: boolean }) {
          this.wasNew = this.isNew;

          if (this.isModified("password")) {
            this.password = await securityService.hashOperation({
              plainText: this.password,
            });
          }

          if (this.phone && this.isModified("phone")) {
            const phoneEncrypted = securityService.encryptValue({
              value: this.phone,
            });
            this.phone = phoneEncrypted;
          }
        },
      );

      userSchema.post(
        "save",
        async function (this: IHUser & { wasNew: boolean }) {
          try {
            if (this.wasNew) {
              // await mailService.sendEmailOtp({
              //   email: this.email,
              //   emailType: EmailTypeEnum.confirmEmail,
              //   subject: "Confirm Your Email",
              // });
            }
          } catch (error) {
            console.log(error);
          }
        },
      );

      userSchema.pre(["findOne", "find"], function () {
        const query = this.getQuery();

        if (!query.getSoftDelete) {
          this.setQuery({ ...query, deletedAt: { $exists: false } });
        }
      });

      return userSchema;
    },

    imports: [SecurityModule],
    inject: [SecurityService],
  },
]);
export default userModel;
