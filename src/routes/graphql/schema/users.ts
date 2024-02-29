/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLList, GraphQLString } from "graphql";
import { ChangeUserInputType, CreateUserInputType, UserType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";
import { ChangeUserInput, CreateUserInput, IUser } from "../models/models.js";

export async function getUser(id: string, context: PrismaClient, currentDepth?: number) {
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
  resolve: async (_root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return getUser(id, context);
  },
}

export const users = {
  type: new GraphQLList(UserType),
  resolve: async (_root, _args, context: PrismaClient) => {
    const users = await context.user.findMany();
    if (!users) {
      return null;
    }

    return users.map((user) => getUser(user.id, context));
  },
}

export const deleteUser = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    await context.user.delete({ where: { id } });
    return '';
  },
}

export const createUser = {
  type: UserType,
  args: { 
    dto: { type: CreateUserInputType } 
  },
  resolve: (_root, args: { dto: CreateUserInput }, context: PrismaClient) => {
    return context.user.create({ data: args.dto });
  },
}

export const changeUser = {
  type: UserType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeUserInputType } 
  },
  resolve: async (_root, args: { id: string, dto: ChangeUserInput }, context: PrismaClient) => {
    return context.user.update({
      where: { id: args.id }, 
      data: { ...args.dto }
    });
  },
}