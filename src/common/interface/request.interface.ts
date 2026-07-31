import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IHUser } from "src/models/User.model";

export interface IRequestAuth extends Request {
  user: IHUser;
  tokenPayload: JwtPayload;
}
