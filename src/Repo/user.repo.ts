import type { Model, ObjectId, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { IHUser, User } from "src/models/User.model";
import DBRepo from "./db.repo.js";

@Injectable()
export class UserRepo extends DBRepo<IHUser> {
  constructor(@InjectModel(User.name) private _userModel: Model<IHUser>) {
    super(_userModel);
  }

  async checkUserExists(id: Types.ObjectId): Promise<boolean> {
    return (await this.findOne({ filter: { _id: id } })) != null;
  }
}
