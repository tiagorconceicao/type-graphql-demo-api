import { graphql } from "graphql";
import { buildSchema } from "type-graphql";
import path from "path";
import { customAuthChecker } from "../src/middlewares/AuthChecker";
import { SessionGuards } from "../src/commons/guardHandler";

const schema = buildSchema({
  resolvers: [path.join(__dirname, "../src/resources/**/*.resolver.ts")],
  validate: false,
  authChecker: customAuthChecker,
});

export const graphqlTestCall = async (
  query: any,
  sessionGuards?: SessionGuards,
  variables?: any
) => {
  return graphql(
    await schema,
    query,
    undefined,
    {
      req: {
        session: sessionGuards,
      },
      res: {
        clearCookie: () => {},
      },
    },
    variables
  );
};
