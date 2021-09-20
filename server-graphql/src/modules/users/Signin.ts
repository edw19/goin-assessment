import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../@types/MyContext";
import { UserService } from "../../services/user.service";
import { InputSignInCredentials } from "./Inputs";

@Resolver()
export class SignResolver {
  @Mutation(() => String, { nullable: true })
  async signin(
    @Arg("credentials") { email, password }: InputSignInCredentials,
    @Ctx() { req }: MyContext
  ) {
    try {
      const { accessToken, id } = await UserService.login({ email, password });
      req.id = id;
      return accessToken;
    } catch (error) {
      throw new Error(error);
    }
  }
}
