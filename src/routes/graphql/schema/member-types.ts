import { GraphQLList } from "graphql";
import { MemberType, MemberTypeIdType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";

export const memberTypes = {
    type: new GraphQLList(MemberType),
    resolve: (_root, _args, context: { prisma: PrismaClient }) => {
      return context.prisma.memberType.findMany();
    },
}

export const memberType = {
    type: MemberType,
    args: {
        id: { type: MemberTypeIdType },
    },
    resolve: (_root, args: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.memberType.findFirst({ where: { id: args.id } });
    },
}