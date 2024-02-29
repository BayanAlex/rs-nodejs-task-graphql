import { GraphQLList, GraphQLString } from "graphql";
import { ChangePostInputType, CreatePostInputType, PostType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";
import { ChangePostInput, CreatePostInput } from "../models/models.js";

export const post = {
  type: PostType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (_root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.post.findUnique({ where: { id } });
  },
}

export const posts = {
  type: new GraphQLList(PostType),
  resolve: (_root, _args, context: PrismaClient) => {
    return context.post.findMany();
  },
}

export const deletePost = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    await context.post.delete({ where: { id } });
    return '';
  },
}

export const createPost = {
  type: PostType,
  args: { 
    dto: { type: CreatePostInputType } 
  },
  resolve: (_root, args: { dto: CreatePostInput }, context: PrismaClient) => {
    return context.post.create({ data: args.dto });
  },
}

export const changePost = {
  type: PostType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangePostInputType } 
  },
  resolve: (_root, args: { id: string, dto: ChangePostInput }, context: PrismaClient) => {
    return context.post.update({
      where: { id: args.id }, 
      data: { ...args.dto }
    });
  },
}