/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLList, GraphQLResolveInfo, GraphQLString } from "graphql";
import { ChangeUserInputType, CreateUserInputType, UserType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";
import { ChangeUserInput, CreateUserInput } from "../models/models.js";
import { Loaders } from "../loaders/loaders.js";
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";

export const user = {
  type: UserType,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: { prisma: PrismaClient }) => {
    return context.prisma.user.findFirst({ where: { id: args.id } });
  },
}

export const users = {
  type: new GraphQLList(UserType),
  resolve: async (_root, _args, context: { prisma: PrismaClient, loaders: Loaders }, info: GraphQLResolveInfo) => {
    const { fields } = simplifyParsedResolveInfoFragmentWithType(
      parseResolveInfo(info) as ResolveTree,
      info.returnType
    );
    const users = await context.prisma.user.findMany({
      include: {
        subscribedToUser: 'subscribedToUser' in fields,
        userSubscribedTo: 'userSubscribedTo' in fields,
      }
    });
    users.forEach((user) => context.loaders.users.prime(user.id, user));
    return users;
  },
}

export const deleteUser = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: { prisma: PrismaClient }) => {
    const { id } = args;
    await context.prisma.user.delete({ where: { id } });
    return '';
  },
}

export const createUser = {
  type: UserType,
  args: { 
    dto: { type: CreateUserInputType } 
  },
  resolve: (_root, args: { dto: CreateUserInput }, context: { prisma: PrismaClient }) => {
    return context.prisma.user.create({ data: args.dto });
  },
}

export const changeUser = {
  type: UserType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeUserInputType } 
  },
  resolve: async (_root, args: { id: string, dto: ChangeUserInput }, context: { prisma: PrismaClient }) => {
    return context.prisma.user.update({
      where: { id: args.id }, 
      data: { ...args.dto }
    });
  },
}