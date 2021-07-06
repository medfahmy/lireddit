import { MikroORM } from "@mikro-orm/core";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { Context } from "./types";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail";
import { User } from "./entities/User";

// console.log("dirname :", __dirname);

const main = async () => {
  const orm = await MikroORM.init(config);
  // await orm.em.nativeDelete(User, {});
  orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);
  // await orm.em.nativeInsert(Post, { title: "my second post" });

  // const users = await orm.em.find(User, {});
  // console.log("users", users);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // redisClient.on("error", (err) => {
  //   console.log("error: ", err);
  // });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cookie only works in https
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "fizegjjlijgrzgzef",
      resave: false,
    })
  );

  const appoloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ em: orm.em, req, res }),
  });

  appoloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server running at localhost:4000");
  });
};

main().catch((err) => console.log(err));
