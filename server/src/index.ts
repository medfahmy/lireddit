import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { Context } from "./types";

// console.log("dirname :", __dirname);

const main = async () => {
  const connection = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });

  //const orm = await MikroORM.init(config);
  // await orm.em.nativeDelete(User, {}); // wipe table user
  // orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);
  // await orm.em.nativeInsert(Post, { title: "my second post" });

  // const users = await orm.em.find(User, {});
  // console.log("users", users);

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

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
        client: redis,
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
    context: ({ req, res }): Context => ({ req, res, redis }),
  });

  appoloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("** server running at localhost:4000 **");
  });
};

main().catch((err) => console.log(err));
