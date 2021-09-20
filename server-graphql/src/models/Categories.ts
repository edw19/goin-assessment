import { prop, getModelForClass, ModelOptions } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@ModelOptions({
    options: { customName: "categories" },
    schemaOptions: { timestamps: true, versionKey: false },
})
@ObjectType()
export class Categories {
    @Field()
    id: string;

    @Field()
    @prop()
    name: string;
}

export const CategoriesModel = getModelForClass(Categories);
