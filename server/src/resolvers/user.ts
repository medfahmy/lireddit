import { User } from "../entities/User";
import { Context } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import argon2 from "argon2";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
export class UserInput {
  @Field()
  username: string;
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    if (!req.session.userID) {
      return null;
    }

    return User.findOne(req.session.userID);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials") credendtials: UserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const errors = validateRegister(credendtials);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(credendtials.password);
    const user = User.create({
      username: credendtials.username,
      email: credendtials.email,
      password: hashedPassword,
    });

    try {
      await user.save();
    } catch (err) {
      if (err.code === "23505") {
        //|| err.detail.includes("already exists")) { //duplicate username error
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
      console.log("message: ", err.message);
    }

    console.log(user);
    req.session.userID = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    let login = usernameOrEmail.includes("@")
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail };

    const user = await User.findOne({ where: login });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "username or email doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return { errors: [{ field: "password", message: "incorrect password" }] };
    }

    req.session.userID = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Ctx() { redis }: Context, @Arg("email") email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 3600 * 24 * 3
    );
    const message = `<a href="http://localhost:3000/change-password/${token}">reset password</a>`;

    await sendEmail(email, message);

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, redis }: Context
  ): Promise<UserResponse> {
    if (newPassword.length < 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userID = await redis.get(key);
    if (!userID) {
      return {
        errors: [
          {
            field: "token",
            message: "token invalid or expired",
          },
        ],
      };
    }

    const userIDNum = parseInt(userID);
    const user = await User.findOne(userIDNum);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    await User.update(
      { id: userIDNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    req.session.userID = user.id;

    return { user };
  }
}
