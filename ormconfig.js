require("dotenv").config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

module.exports = {
  type: process.env.TYPEORM_TYPE,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  database: process.env.TYPEORM_DATABASE,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  synchronize: false,
  logging: process.env.TYPEORM_LOG ? true : false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/database/migrations/**/*.ts"],
  subscribers: ["src/database/subscribers/**/*.ts"],
  seeds: ["src/database/seeds/**/*{.ts,.js}"],
  factories: ["src/database/factories/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/database/migrations",
    subscribersDir: "src/subscribers",
  },
};
