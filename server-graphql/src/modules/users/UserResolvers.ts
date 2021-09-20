import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../../@types/MyContext";
import { Users } from "../../models/Users";
import { ProductsService } from "../../services/products.service";
import { UserService } from "../../services/user.service";
import { ADMIN, CLIENT } from "../roles";
import { InputProductsBuy } from "./Inputs";
import { ProductDeleted } from "./Types";

@Resolver()
export class UserResolver {
  @Authorized([ADMIN, CLIENT])
  @Query(() => Users, { nullable: true })
  async getUser(@Ctx() { req }: MyContext) {
    return await UserService.getUser(req.id);
  }

  @Authorized([ADMIN, CLIENT])
  @Mutation(() => [ProductDeleted], { nullable: true })
  async createBuy(
    @Ctx() { req }: MyContext,
    @Arg("products", () => [InputProductsBuy]) products: InputProductsBuy[],
    @Arg("total") total: string
  ) {
    try {
      // verify if there is stock
      let productsInfo = [];

      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const { stock, name } = await ProductsService.getStockProduct(
          product.id
        );
        if (stock === 0) {
          productsInfo.push({ id: product.id, name: name });
        }
      }

      if (Object.keys(productsInfo).length > 0) {
        return productsInfo;
      }

      // discount stock foreach product
      products.forEach(async (product) => {
        await ProductsService.discountStock(product.id, product.units);
      });
      await UserService.createExpense(req.id, total);
    } catch (error) {
      throw new Error(error);
    }
  }
}
