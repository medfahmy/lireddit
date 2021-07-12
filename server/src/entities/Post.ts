import {
  Column,
  CreateDateColumn,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;
}
