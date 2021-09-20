import { Users, UsersModel } from "../models/Users";
import {
  InputCreateUser,
  InputSignInCredentials,
  InputUpdateUser,
} from "../modules/users/Inputs";
import { ValidationError } from "apollo-server-express";
import { PasswordService } from "./password.service";
import { JWT } from "./jwt.service";

export class UserService {
  static async create(user: InputCreateUser): Promise<string> {
    try {
      // verify if user dont exist
      const userExists = await UsersModel.findOne({ email: user.email });
      if (userExists) {
        throw new Error("Usuario ya registrado, trata con un email diferente");
      }

      // hashear password
      const encryptedPassword = PasswordService.encryptPassword(user.password);
      // asign to password hashed
      user.password = encryptedPassword;

      // register new user
      const registerdUser = await UsersModel.create(user);
      return registerdUser.id;
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async update(user: InputUpdateUser): Promise<Users> {
    try {
      // verify if user exists
      const userExists = await UsersModel.findById(user.id);
      if (!userExists) {
        throw new Error("Usuario no registrado");
      }
      // encriptar new password
      if (user.password) {
        const encryptedPassword = PasswordService.encryptPassword(
          user.password
        );
        user.password = encryptedPassword;
      } else {
        delete user.password;
      }

      const updateUser = await UsersModel.findByIdAndUpdate(user.id, user, {
        returnOriginal: false,
      });
      return updateUser;
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async login({ email, password }: InputSignInCredentials) {
    try {
      const user = await UsersModel.findOne({ email });
      if (!user) {
        throw new Error("Credenciales inválidas");
      }
      if (
        PasswordService.comparePasswords({
          password,
          storedPassword: user.password,
        })
      ) {
        return {
          accessToken: JWT.createToken({ id: user.id }),
          id: user.id,
        };
      }
      throw new Error("Credenciales inválidas");
    } catch (error) {
      throw new ValidationError(error);
    }
  }
  static async getRoleUser(id: string) {
    const { role } = await UsersModel.findById(id).select("role -_id");
    return role;
  }
  static async getUser(id: string) {
    const user = UsersModel.findById(id);
    return user;
  }
  static async createExpense(id: string, expense: string) {
    try {
      await UsersModel.findByIdAndUpdate(id, {
        $addToSet: { expenses: { expense } },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
