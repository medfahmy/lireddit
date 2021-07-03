import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Property()
  @Field(() => String)
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;
}
