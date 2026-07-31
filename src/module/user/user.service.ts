import { Injectable } from "@nestjs/common";
import { UserRepo } from "src/Repo/user.repo";

@Injectable()
export class UserService {
  // constructor(private _userModel: UserRepo) {}
  // async getUser() {
  //   return await this._userModel.find({});
  // }
}
