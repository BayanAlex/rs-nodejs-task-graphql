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
  resolve: async (_root, args: { userId: string, authorId: string }, context: PrismaClient) => {
    const { userId: subscriberId, authorId } = args;
    return context.subscribersOnAuthors.create({ data: { subscriberId, authorId } });
  },
}

export const unsubscribeFrom = {
  type: GraphQLString,
  args: { 
    userId: { type: UUIDType }, 
    authorId: { type: UUIDType }, 
  },
  resolve: async (_root, args: { userId: string, authorId: string }, context: PrismaClient) => {
    const { userId: subscriberId, authorId } = args;
    await context.subscribersOnAuthors.delete({ where: { subscriberId_authorId: { subscriberId, authorId }} });
    return '';
  },
}