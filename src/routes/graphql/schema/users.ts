/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLFloat, GraphQLList, GraphQLString } from "graphql";
import { IUser, UserType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";

async function getUser(id: string, context: PrismaClient, currentDepth?: number) {
  if (currentDepth === 5) {
    return null;
  }

  const user = await context.user.findUnique({ 
    where: { id }, 
    include: { 
      posts: true, 
      profile: {
        include: {
          memberType: true,
          user: true,
        }
      },
      subscribedToUser: {
        select: {
          subscriberId: true,
        },
      },
      userSubscribedTo: {
        select: {
          authorId: true
        },
      }
    }
  });

  if (!user) {
    return null;
  }

  const depth = (currentDepth ?? 0) + 1;
  const subscribedToUser = (await Promise.all(user.subscribedToUser.map((user) => getUser(user.subscriberId, context, depth)))).filter(Boolean);
  const userSubscribedTo = (await Promise.all(user.userSubscribedTo.map((user) => getUser(user.authorId, context, depth)))).filter(Boolean);

  const result: IUser = {
    ...user,
    subscribedToUser,
    userSubscribedTo
  };

  return result;
}

export const user = {
  type: UserType,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return getUser(id, context);
  },
}

export const users = {
  type: new GraphQLList(UserType),
  resolve: async (root, args, context: PrismaClient) => {
    const users = await context.user.findMany();
    if (!users) {
      return null;
    }

    return users.map((user) => getUser(user.id, context));
  },
}

export const deleteUser = {
  type: UserType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.user.delete({ where: { id } });
  },
}

export const createUser = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
  resolve: async (root, args: { name: string, balance: number }, context: PrismaClient) => {
    return context.user.create({ data: args });
  },
}

export const changeUser = {
  type: UserType,
  args: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
  resolve: async (root, args: { id: string, name: string, balance: number }, context: PrismaClient) => {
    const { id, name, balance } = args;
    return context.user.update({
      where: { id }, 
      data: { name, balance }
    });
  },
}