/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import { UserType } from "../types/types.js";
import { UUIDType } from "../types/uuid.js";
import { GraphQLString } from "graphql";

export const subscribeTo = {
  type: UserType,
  args: { 
    userId: { type: UUIDType }, 
    authorId: { type: UUIDType }, 
  },
  resolve: async (_root, args: { userId: string, authorId: string }, context: { prisma: PrismaClient }) => {
    const { userId: subscriberId, authorId } = args;
    return context.prisma.subscribersOnAuthors.create({ data: { subscriberId, authorId } });
  },
}

export const unsubscribeFrom = {
  type: GraphQLString,
  args: {
    userId: { type: UUIDType },
    authorId: { type: UUIDType },
  },
  resolve: async (_root, args: { userId: string, authorId: string }, context: { prisma: PrismaClient }) => {
    const { userId: subscriberId, authorId } = args;
    await context.prisma.subscribersOnAuthors.delete({ where: { subscriberId_authorId: { subscriberId, authorId }} });
    return '';
  },
}