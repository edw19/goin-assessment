import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createSchemaGraphql } from "./utils/createSchemaGraphql";
import { MyContext } from "./@types/MyContext";
import cookieParser from "cookie-parser";
import cors from "cors";
import { JWT } from "./services/jwt.service";
import { graphqlUploadExpress } from "graphql-upload";

export async function startServer() {
  const apolloServer = new ApolloServer({
    context: async ({ req, res }: MyContext) => {
      // if exists a user authenticated put id in context
      if (req.headers.authorization) {
        const authorization = req.headers.authorization?.split(" ");
        const accessToken = authorization[1];
        if (!accessToken) return { req, res };
        try {
          const payload = JWT.verifyAccessToken(accessToken);
          req.id = payload.id;
          return { req, res };
        } catch (error) {}
      }
      return { req, res };
    },
    schema: createSchemaGraphql(),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  const app = express();

  // middlewares
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app });

  return { app, apolloServer };
}
