require("dotenv").config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import redis from "redis";
import Session from "express-session";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(Session);

export const session = Session({
  name: process.env.SESSION_COOKIE_NAME || "qid",
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || "mysecret12345",
  resave: false,
  store: new RedisStore({
    client: redis.createClient({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "") || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    }),
    disableTouch: true,
  }),
  cookie: {
    maxAge: 86400000 * 6, // 6 months
    httpOnly: true,
    sameSite: "lax", //csrf
    secure: false, // set true to only work on https
  },
});
