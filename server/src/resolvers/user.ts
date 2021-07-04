import { User } from "../entities/User";
import { Context } from "src/types";
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

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: Context) {
    if (!req.session.userID) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userID });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials") credendtials: UsernamePasswordInput,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    if (credendtials.username.length < 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    if (credendtials.password.length < 6) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 6",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(credendtials.password);
    const user = em.create(User, {
      username: credendtials.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
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
    @Arg("credentials") credendtials: UsernamePasswordInput,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: credendtials.username.toLowerCase(),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, credendtials.password);
    if (!valid) {
      console.log("not valid");
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userID = user.id;

    return {
      user,
    };
  }
}
