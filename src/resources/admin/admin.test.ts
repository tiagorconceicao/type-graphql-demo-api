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

describe("Admin Resolvers", () => {
  it("must be logged to query Admins", async () => {
    response = await graphqlTestCall(`
    query {
      admins {
        data {
          id
        }
      }
    }
    `);

    expect(response.errors).toBeDefined();
  });

  it("create Admin", async () => {
    response = await graphqlTestCall(
      `
    mutation {
      createAdmin(
        firstName: "Test"
        lastName: "Name"
        email: "test2@test.com"
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

    expect(response.data!.createAdmin!.data!.email!).toBe("test2@test.com");
  });
});
