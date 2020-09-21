require("dotenv").config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import "reflect-metadata";
import path from "path";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext } from "./commons/types";
import { customAuthChecker } from "./middlewares/AuthChecker";
import { session } from "../redis.config";
import morgan from "morgan";

const port: number = parseInt(process.env.SERVER_PORT || "") || 4000;

export const App = async () => {
  await createConnection();
  const app = express();

  // Redis Session
  app.use(session);
  app.use(morgan("dev"));

  // Apollo GraphQL Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname, "resources/**/*.resolver.ts")],
      validate: false,
      authChecker: customAuthChecker,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log("________________________________________________________________________________");
    console.log("Server started on port:", port, `| GraphQL >>> http://localhost:${port}/graphql`);
  });
};

App().catch((err) => {
  console.error(err);
});
