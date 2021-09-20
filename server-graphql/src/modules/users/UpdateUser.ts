import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Users } from "../../models/Users";
import { UserService } from "../../services/user.service";
import { ADMIN, CLIENT } from "../roles";
import { InputUpdateUser } from "./Inputs";

@Resolver()
export class UpdateUserResolver {
  @Authorized([ADMIN, CLIENT])
  @Mutation(() => Users)
  async updateUser(@Arg("user") user: InputUpdateUser) {
    try {
      return await UserService.update(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}
