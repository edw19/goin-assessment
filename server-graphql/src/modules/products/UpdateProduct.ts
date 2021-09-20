import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Products } from "../../models/Products";
import { ProductsService } from "../../services/products.service";
import { InputUpdateProduct } from "./Inputs";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream, unlinkSync } from "fs";
import { ADMIN } from "../roles";
const cloudinary = require("cloudinary").v2;

@Resolver()
export class UpdateProductResolver {
  @Authorized([ADMIN])
  @Mutation(() => Products)
  async updateProduct(
    @Arg("image", () => GraphQLUpload, { nullable: true })
    image: FileUpload,
    @Arg("product") product: InputUpdateProduct
  ) {
    try {
      let imageUri = "";
      if (image) {
        const writableStream = createWriteStream(
          `${__dirname}/../../temp/${image.filename}`,
          { autoClose: true }
        );

        await new Promise((res, rej) => {
          image
            .createReadStream()
            .pipe(writableStream)
            .on("finish", () => res(true))
            .on("error", () => rej(false));
        });

        const { secure_url } = await cloudinary.uploader.upload(
          `${__dirname}/../../temp/${image.filename}`,
          {
            folder: "ecommerce",
          }
        );
        imageUri = secure_url;
      }
      // update image
      const updateProduct = await ProductsService.update(product, imageUri);
      if (image) {
        unlinkSync(`${__dirname}/../../temp/${image.filename}`);
      }
      return updateProduct;
    } catch (error) {
      throw new Error(error);
    }
  }
}
