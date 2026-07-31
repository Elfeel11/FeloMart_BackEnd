import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IHUser } from "src/models/User.model.js";
import { IRequestAuth } from "./../interface/request.interface";

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let req!: IRequestAuth;

    switch (context.getType()) {
      case "http":
        req = context.switchToHttp().getRequest();
        break;
      default:
        break;
    }

    return req.user;
  },
);
