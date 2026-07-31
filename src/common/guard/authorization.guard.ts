import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenService } from "../services/token.service";
import { IRequestAuth } from "../interface/request.interface";
import { RoleEnum } from "../enums/user.enums.js";
import { IHUser } from "src/models/User.model.js";

@Injectable()
export class Authoriaztionuard implements CanActivate {
  constructor(private _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req!: IRequestAuth;
    let user!: IHUser;

    switch (context.getType()) {
      case "http":
        req = context.switchToHttp().getRequest();
        user = req.user;
        break;
      default:
        break;
    }

    const roles: RoleEnum[] = this._reflector.getAllAndOverride("Roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    return roles.includes(user.role);
  }
}
