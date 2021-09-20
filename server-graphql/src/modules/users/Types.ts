import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ProductDeleted {
  @Field()
  id: string;

  @Field()
  name: string;
}
