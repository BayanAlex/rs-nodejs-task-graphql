import { GraphQLList, GraphQLString } from "graphql";
import { ChangePostInputType, CreatePostInputType, PostType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";
import { ChangePostInput, CreatePostInput, IUser } from "../models/models.js";
import { Loaders } from "../loaders/loaders.js";

export const post = {
  type: PostType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (_root, args: { id: string }, context: { prisma: PrismaClient }) => {
    return context.prisma.post.findFirst({ where: { id : args.id } });
  },
}

export const posts = {
  type: new GraphQLList(PostType),
  resolve: (_root, _args, context: { prisma: PrismaClient, loaders: Loaders }) => {
    return context.prisma.post.findMany();
  },
}

export const deletePost = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: { prisma: PrismaClient }) => {
    const { id } = args;
    await context.prisma.post.delete({ where: { id } });
    return '';
  },
}

export const createPost = {
  type: PostType,
  args: { 
    dto: { type: CreatePostInputType } 
  },
  resolve: (_root, args: { dto: CreatePostInput }, context: { prisma: PrismaClient }) => {
    return context.prisma.post.create({ data: args.dto });
  },
}

export const changePost = {
  type: PostType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangePostInputType } 
  },
  resolve: (_root, args: { id: string, dto: ChangePostInput }, context: { prisma: PrismaClient }) => {
    return context.prisma.post.update({
      where: { id: args.id }, 
      data: { ...args.dto }
    });
  },
}