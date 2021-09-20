import { prop, getModelForClass, ModelOptions } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@ModelOptions({
  options: { customName: "products" },
  schemaOptions: { timestamps: true, versionKey: false },
})
@ObjectType()
export class Products {
  @Field()
  id: string;

  @Field()
  @prop()
  category: string

  @Field()
  @prop()
  name: string;

  @Field()
  @prop()
  price: string;

  @Field(() => Int)
  @prop()
  stock: number;

  @Field()
  @prop()
  image: string;
}

export const ProductsModel = getModelForClass(Products);
