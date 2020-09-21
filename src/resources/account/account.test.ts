import { ExecutionResult } from "graphql";
import { Connection, createConnection } from "typeorm";
import { graphqlTestCall } from "../../../__tests__/graphqlTestCall";
let conn: Connection;

beforeAll(async () => {
  conn = await createConnection();
});

afterAll(async () => {
  await conn.close();
});

let response: ExecutionResult;

describe("Account Resolvers", () => {
  it("must be logged to query Accounts", async () => {
    response = await graphqlTestCall(`
    query {
      accounts {
        data {
          id
        }
      }
    }
    `);

    expect(response.errors).toBeDefined();
  });

  it("must has a valid email", async () => {
    response = await graphqlTestCall(
      `
    mutation {
      createAccount(
        name: "Test1"
        slug: "test1"
        email: "test1@test.com"
        password: "12345"
      ) {
        data {
          id
          email
        }
      }
    }
    `,
      { admin: { id: 1, uuid: "fake-uuid" } }
    );
    expect(response.data!.createAccount!.data!.email!).toBe("test1@test.com");
  });

  it("must has a valid email", async () => {
    response = await graphqlTestCall(
      `
    mutation {
      createAccount(
        name: "Test2"
        slug: "test2"
        email: "test2@test"
        password: "12345"
      ) {
        data {
          id
          email
        }
      }
    }
    `,
      { admin: { id: 1, uuid: "fake-uuid" } }
    );
    expect(response.data!.createAccount!.erros!).not.toBeNull();
  });
});
