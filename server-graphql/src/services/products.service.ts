import { ValidationError } from "apollo-server-express";
import { Products, ProductsModel } from "../models/Products";
import {
  InputCreateProduct,
  InputUpdateProduct,
} from "../modules/products/Inputs";

export class ProductsService {
  static async create(
    product: InputCreateProduct,
    image: string
  ): Promise<Products> {
    try {
      const newProduct = await ProductsModel.create({ ...product, image });
      return newProduct;
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async update(product: InputUpdateProduct, image?: string) {
    try {
      const productExists = await ProductsModel.findById(product.id);
      if (!productExists) {
        throw new Error("El producto que intentas actualizar no existe");
      }

      if (image) {
        await ProductsModel.findByIdAndUpdate(
          product.id,
          { $set: { image } },
          { returnOriginal: false }
        );
      }

      const updateProduct = await ProductsModel.findByIdAndUpdate(
        product.id,
        product,
        { returnOriginal: false }
      );
      return updateProduct;
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async delete(id: string): Promise<void> {
    try {
      await ProductsModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getProduct(id: string) {
    try {
      const product = await ProductsModel.findById(id);
      return product;
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async getProducts() {
    try {
      const products = await ProductsModel.find({}).where("stock").gt(0);
      return products;
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async getStockProduct(id: string) {
    try {
      const stock = await ProductsModel.findById(id).select("stock -_id name");
      return stock;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async discountStock(id: string, units: number) {
    try {
      await ProductsModel.findByIdAndUpdate(id, { $inc: { stock: -units } });
    } catch (error) {
      throw new Error(error);
    }
  }
}
