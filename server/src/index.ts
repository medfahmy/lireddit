import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import config from "./mikro-orm.config";
import express from "express";

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
  app.get("/", (_, res) => {
    res.send("hello");
  });
  app.listen(4000, () => {
    console.log("server running at localhost:4000");
  });
};

main().catch((err) => console.log(err));
