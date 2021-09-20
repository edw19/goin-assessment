import { CategoriesModel } from '../models/Categories'

export class CategoriesService {
    static async createCategory({ name }: { name: string }) {
        return await CategoriesModel.create({ name })
    }

    static async getCategories() {
        return await CategoriesModel.find({})
    }
}