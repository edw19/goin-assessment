import { Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../@types/MyContext";
import { ADMIN, CLIENT } from "../roles";

@Resolver()
export class LogoutResolver {
  @Authorized([ADMIN, CLIENT])
  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: MyContext) {
    req.id = "";
    return true;
  }
}
