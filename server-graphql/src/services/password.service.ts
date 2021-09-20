import { genSaltSync, hashSync, compareSync } from "bcrypt";

interface IPasswords {
  password: string;
  storedPassword: string;
}

export class PasswordService {
  static encryptPassword(password: string): string {
    const salts = genSaltSync(10);
    const hashPassword = hashSync(password, salts);
    return hashPassword;
  }
  static comparePasswords({ password, storedPassword }: IPasswords): Boolean {
    return compareSync(password, storedPassword);
  }
}
