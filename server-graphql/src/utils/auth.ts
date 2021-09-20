import { AuthChecker } from "type-graphql";
import { MyContext } from "../@types/MyContext";
import { AuthenticationError } from "apollo-server-express";
import { JWT } from "../services/jwt.service";
import { UserService } from "../services/user.service";

export const authChecker: AuthChecker<MyContext> = async (
  { context },
  roles
) => {
  const authorization = context.req.headers.authorization.split(" ");
  const accessToken = authorization[1];
  if (!accessToken || !context.req.headers.authorization) {
    throw new AuthenticationError("Es necesario iniciar sesión");
  }
  
  try {
    // verificar rol
    const payload = JWT.verifyAccessToken(accessToken);
    const role = await UserService.getRoleUser(payload.id);
    return roles.includes(role);
  } catch (error) {
    return false;
  }
};
