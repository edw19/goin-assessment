import { InputType, Field } from "type-graphql";
import { IsEmail, length, Length } from "class-validator";

@InputType()
export class InputCreateUserAbstract {
  @Field()
  @IsEmail()
  email: string;

  @Length(2, 20)
  @Field()
  name: string;

  @Field()
  @Length(2, 20)
  secondName: string;

  @Field()
  @Length(2, 20)
  surname: string;

  @Field()
  @Length(2, 20)
  secondSurname: string;

  @Field()
  @Length(2, 50)
  address: string;

  @Field()
  role: string;
}

@InputType()
export class InputCreateUser extends InputCreateUserAbstract {
  @Field()
  password: string;
}

@InputType()
export class InputUpdateUser extends InputCreateUserAbstract {
  @Field()
  id: string;

  @Field({ nullable: true })
  password?: string;
}

@InputType()
export class InputSignInCredentials {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(2, 20)
  password: string;
}

@InputType()
export class InputProductsBuy {
  @Field()
  id: string;

  @Field()
  units: number;
}
