import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Products } from "../../models/Products";
import { ProductsService } from "../../services/products.service";
import { ADMIN } from "../roles";

@Resolver()
export class ProductsResolver {
  @Query(() => Products)
  async getProduct(@Arg("id") id: string) {
    try {
      const findProduct = await ProductsService.getProduct(id);
      return findProduct;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => [Products])
  async getProducts() {
    try {
      const findProduct = await ProductsService.getProducts();
      return findProduct;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized([ADMIN])
  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id") id: string) {
    try {
      await ProductsService.delete(id);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
