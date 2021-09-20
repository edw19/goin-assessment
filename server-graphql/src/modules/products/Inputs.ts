import { IsInt, MaxLength } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class InputCreateProduct {
  @Field()
  @MaxLength(20)
  name: string;

  @Field()
  @MaxLength(10)
  price: string;

  @Field(() => Int)
  @IsInt()
  stock: number;

  @Field()
  category: string
}

@InputType()
export class InputUpdateProduct extends InputCreateProduct {
  @Field()
  id: string;
}
