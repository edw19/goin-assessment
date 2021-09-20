import { Arg, Mutation, Resolver } from "type-graphql";
import { UserService } from "../../services/user.service";
import { InputCreateUser } from "./Inputs";

@Resolver()
export class RegisterResolver {
  @Mutation(() => Boolean)
  async signup(@Arg("user") user: InputCreateUser) {
    try {
      await UserService.create(user);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
