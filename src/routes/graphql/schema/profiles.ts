import { GraphQLList, GraphQLString } from "graphql";
import { ProfileType, CreateProfileInputType, ChangeProfileInputType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { UUIDType } from "../types/uuid.js";
import { ChangeProfileInput, CreateProfileInput } from "../models/models.js";

export const profile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (_root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.profile.findUnique({ where: { id }, include: { memberType: true, user: true } });
  },
}

export const profiles = {
  type: new GraphQLList(ProfileType),
  resolve: (_root, _args, context: PrismaClient) => {
    return context.profile.findMany({ include: { memberType: true, user: true } });
  },
}

export const deleteProfile = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    await context.profile.delete({ where: { id } });
    return '';
  },
}

export const createProfile = {
  type: ProfileType,
  args: { 
    dto: { type: CreateProfileInputType } 
  },
  resolve: (_root, args: { dto: CreateProfileInput }, context: PrismaClient) => {
    return context.profile.create({ data: args.dto });
  },
}

export const changeProfile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeProfileInputType } 
  },
  resolve: async (_root,  args: { id: string, dto: ChangeProfileInput }, context: PrismaClient) => {
    return context.profile.update({
      where: { id: args.id }, 
      data: { ...args.dto }
    });
  },
}