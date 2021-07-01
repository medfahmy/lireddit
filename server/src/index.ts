import { MikroORM } from "@mikro-orm/core";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

import { __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

// console.log("dirname :", __dirname);

const main = async () => {
  const orm = await MikroORM.init(config);
  orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);
  // await orm.em.nativeInsert(Post, { title: "my second post" });

  // const posts = await orm.em.find(Post, {});
  // console.log(posts);

  const app = express();

  const appoloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  appoloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server running at localhost:4000");
  });
};

main().catch((err) => console.log(err));
