import { GraphQLBoolean, GraphQLInt, GraphQLList } from "graphql";
import { ProfileType, MemberTypeIdType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { MemberTypeId } from "../../member-types/schemas.js";
import { UUIDType } from "../types/uuid.js";

export const profile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.profile.findUnique({ where: { id }, include: { memberType: true, user: true } });
  },
}

export const profiles = {
  type: new GraphQLList(ProfileType),
  resolve: (root, args, context: PrismaClient) => {
    return context.profile.findMany({ include: { memberType: true, user: true } });
  },
}

export const deleteProfile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
  },
  resolve: (root, args: { id: string }, context: PrismaClient) => {
    const { id } = args;
    return context.profile.delete({ where: { id } });
  },
}

export const createProfile = {
  type: ProfileType,
  args: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdType },
  },
  resolve: async (root, args: { isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: MemberTypeId }, context: PrismaClient) => {
    return context.profile.create({ data: args });
  },
}

export const changeProfile = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdType },
  },
  resolve: async (root, args: { id: string, isMale: boolean, yearOfBirth: number, memberTypeId: MemberTypeId }, context: PrismaClient) => {
    const { id, isMale, yearOfBirth, memberTypeId } = args;
    return context.profile.update({
      where: { id }, 
      data: { isMale, yearOfBirth, memberTypeId }
    });
  },
}