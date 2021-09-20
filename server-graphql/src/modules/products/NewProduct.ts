import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { ProductsService } from "../../services/products.service";
import { InputCreateProduct } from "./Inputs";
import { ValidationError } from "apollo-server-express";
import { Products } from "../../models/Products";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream, unlinkSync } from "fs";
import { ADMIN } from "../roles";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "cloudpatricio",
  api_key: "666759311364287",
  api_secret: "R1H9qQUCgoVE-ZGYAeLidm4sRNs",
});

@Resolver()
export class NewProductResolver {
  @Authorized([ADMIN])
  @Mutation(() => Products)
  async createProduct(
    @Arg("product") product: InputCreateProduct,
    @Arg("image", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    try {
      const writableStream = createWriteStream(
        `${__dirname}/../../temp/${filename}`,
        { autoClose: true }
      );

      await new Promise((res, rej) => {
        createReadStream()
          .pipe(writableStream)
          .on("finish", () => res(true))
          .on("error", (e) => rej(false));
      });

      const { secure_url } = await cloudinary.uploader.upload(
        `${__dirname}/../../temp/${filename}`,
        {
          folder: "ecommerce",
        }
      );

      const productCreated = await ProductsService.create(product, secure_url);
      unlinkSync(`${__dirname}/../../temp/${filename}`);
      return productCreated;
    } catch (error) {
      console.log(error)
      throw new ValidationError(error);
    }
  }
}
