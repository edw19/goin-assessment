import { sign, verify } from "jsonwebtoken";

interface IPayload {
  id: string;
}

export class JWT {
  static createToken(payload: IPayload) {
    const token = sign(
      payload,
      "its recommended to generate a hash token as key",
      {
        expiresIn: "24h",
      }
    );
    return token;
  }
  static verifyAccessToken(token: string): IPayload {
    try {
      const payload = verify(
        token,
        "its recommended to generate a hash token as key"
      ) as IPayload;
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }
}
