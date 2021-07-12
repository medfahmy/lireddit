import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";

export type Context = {
  req: Request & { session: Session & Partial<SessionData> };
  res: Response;
  redis: Redis;
};

declare module "express-session" {
  export interface SessionData {
    userID: number;
  }
}
