import { MiddlewareFn } from "type-graphql";
import { Context } from "vm";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userID) {
    throw new Error("not authenticated");
  }

  return next();
};
