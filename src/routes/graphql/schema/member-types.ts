import { GraphQLList } from "graphql";
import { MemberType, MemberTypeIdType } from "../types/types.js";
import { PrismaClient } from "@prisma/client";

export const memberTypes = {
    type: new GraphQLList(MemberType),
    resolve: (root, args, context: PrismaClient) => {
      return context.memberType.findMany();
    },
}

export const memberType = {
    type: MemberType,
    args: {
        id: { type: MemberTypeIdType },
    },
    resolve: (root, args: { id: string }, context: PrismaClient) => {
        const { id } = args;
        return context.memberType.findUnique({ where: { id } });
    },
}