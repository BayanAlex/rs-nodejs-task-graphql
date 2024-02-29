import { GraphQLList, GraphQLString } from "graphql";
import { PostType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";

export const post = {
  type: PostType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.post.findUnique({ where: { id } });
  },
}

export const posts = {
  type: new GraphQLList(PostType),
  resolve: (root, args, context: PrismaClient) => {
    return context.post.findMany();
  },
}

export const deletePost = {
  type: PostType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.post.delete({ where: { id } });
  },
}

export const createPost = {
  type: PostType,
  args: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
  resolve: async (root, args: { title: string, content: string, authorId: string }, context: PrismaClient) => {
    return context.post.create({ data: args });
  },
}

export const changePost = {
  type: PostType,
  args: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
  resolve: async (root, args: { id: string, title: string, content: string }, context: PrismaClient) => {
    const { id, title, content } = args;
    return context.post.update({
      where: { id }, 
      data: { title, content }
    });
  },
}