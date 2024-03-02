import { GraphQLList, GraphQLResolveInfo, GraphQLString } from "graphql";
import { ProfileType, CreateProfileInputType, ChangeProfileInputType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";
import { ChangeProfileInput, CreateProfileInput } from "../models/models.js";
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";
import { Loaders } from "../loaders/loaders.js";

export const profile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (_root, args: { id: string }, context: { prisma: PrismaClient, loaders: Loaders }, info: GraphQLResolveInfo) => {
    const { fields } = simplifyParsedResolveInfoFragmentWithType(
      parseResolveInfo(info) as ResolveTree,
      info.returnType
    );
    return context.prisma.profile.findFirst({ where: { id: args.id }, include: { memberType: 'memberType' in fields } });
  },
}

export const profiles = {
  type: new GraphQLList(ProfileType),
  resolve: (_root, _args, context: { prisma: PrismaClient }, info: GraphQLResolveInfo) => {
    const { fields } = simplifyParsedResolveInfoFragmentWithType(
      parseResolveInfo(info) as ResolveTree,
      info.returnType
    );
    return context.prisma.profile.findMany({ include: { memberType: 'memberType' in fields } });
  },
}

export const deleteProfile = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: { prisma: PrismaClient }) => {
    const { id } = args;
    await context.prisma.profile.delete({ where: { id } });
    return '';
  },
}

export const createProfile = {
  type: ProfileType,
  args: { 
    dto: { type: CreateProfileInputType } 
  },
  resolve: (_root, args: { dto: CreateProfileInput }, context: { prisma: PrismaClient }) => {
    return context.prisma.profile.create({ data: args.dto });
  },
}

export const changeProfile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeProfileInputType } 
  },
  resolve: async (_root,  args: { id: string, dto: ChangeProfileInput }, context: { prisma: PrismaClient }) => {
    return context.prisma.profile.update({
      where: { id: args.id }, 
      data: { ...args.dto }
    });
  },
}