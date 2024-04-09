import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";
import { UUIDType } from "./uuid.js";
import { IProfile, IUser } from "../models/models.js";
import { PrismaClient } from "@prisma/client";
import { Loaders } from "../loaders/loaders.js";

export const MemberTypeIdType = new GraphQLEnumType({ 
  name: 'MemberTypeId', 
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  }
});

export const MemberType = new GraphQLObjectType({ 
  name: 'MemberType', 
  fields: {
    id: { type: MemberTypeIdType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdType },

    memberType: { 
      type: MemberType,
      resolve: (root: IProfile, _args, context: { prisma: PrismaClient, loaders: Loaders }) => {
        return context.loaders.memberTypes.load(root.memberTypeId);
      }
    },
  },
});

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdType },
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdType },
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: { 
      type: ProfileType,
      resolve: (root: IUser, _args, context: { prisma: PrismaClient, loaders: Loaders }) => {
        return context.loaders.profiles.load(root.id);
      },
    },

    posts: { 
      type: new GraphQLList(PostType),
      resolve: async (root: IUser, _args, context: { prisma: PrismaClient, loaders: Loaders }) => {
        return context.loaders.posts.load(root.id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (root: IUser, _args, context: { prisma: PrismaClient, loaders: Loaders }) => {
        return (await context.loaders.userSubscribedTo.load(root.id)) ?? [];
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (root: IUser, _args, context: { prisma: PrismaClient, loaders: Loaders }) => {
        return (await context.loaders.subscribedToUser.load(root.id)) ?? [];
      },
    },
  }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
