import { prop, getModelForClass, ModelOptions } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ModelOptions({
  options: { customName: "users" },
  schemaOptions: { timestamps: true, versionKey: false },
})
@ObjectType()
export class Users {
  @Field()
  id: string;

  @Field()
  @prop()
  email: string;

  @prop()
  password: string;

  @Field()
  @prop()
  name: string;

  @Field()
  @prop()
  secondName: string;

  @Field()
  @prop()
  surname: string;

  @Field()
  @prop()
  secondSurname: string;

  @Field()
  @prop()
  address: string;

  @Field(() => [ExpenseHistory])
  @prop({ type: () => ExpenseHistory })
  expenses?: ExpenseHistory[];

  @Field()
  @prop({ default: "USER-CLIENT" })
  role: string;
}

@ObjectType()
class ExpenseHistory {
  @Field()
  @prop()
  expense: string;

  @Field()
  @prop({ default: Date.now })
  createAt?: Date;
}

export const UsersModel = getModelForClass(Users);
