import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";
import { UUIDType } from "./uuid.js";

export interface IMemberType {
  id: string,
  discount: number,
  postsLimitPerMonth: number,
}

export interface IPost {
  id: string,
  title: string,
  content: string,
  authorId: string,
}

export interface IProfile {
  id: string,
  isMale: boolean,
  yearOfBirth: number,
  userId: string,
  memberTypeId: string,
  memberType: IMemberType,
}

export interface IUser {
  id: string,
  name: string,
  balance: number,
  profile: IProfile | null,
  posts: IPost[],
  userSubscribedTo: (IUser | null)[],
  subscribedToUser: (IUser | null)[],
}

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

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdType },
    memberType: { type: MemberType },
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType },
    posts: { type: new GraphQLList(PostType) },
    userSubscribedTo: { type: new GraphQLList(UserType) },
    subscribedToUser: { type: new GraphQLList(UserType) },
  }),
});
