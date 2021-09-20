import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Categories } from "../../models/Categories";
import { CategoriesService } from "../../services/categories.service";
import { ADMIN } from "../roles";

@Resolver()
export class CategoriesResolver {
    @Query(() => [Categories])
    async getCategories() {
        try {
            const categories = await CategoriesService.getCategories();
            return categories;
        } catch (error) {
            throw new Error(error);
        }
    }

    // @Authorized([ADMIN])
    @Mutation(() => Categories)
    async createCategory(@Arg("name") name: string) {
        try {
            return await CategoriesService.createCategory({ name });
        } catch (error) {
            throw new Error(error);
        }
    }
}
