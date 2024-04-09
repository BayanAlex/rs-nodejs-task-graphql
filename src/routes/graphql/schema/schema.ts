import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { user, users, deleteUser, createUser, changeUser } from './users.js'
import { post, posts, deletePost, createPost, changePost } from './posts.js'
import { profile, profiles, deleteProfile, createProfile, changeProfile } from './profiles.js'
import { memberType, memberTypes } from "./member-types.js";
import { subscribeTo, unsubscribeFrom } from "./subscribes.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user,
      users,
      post,
      posts,
      profile,
      profiles,
      memberType,
      memberTypes,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser,
      changeUser,
      deleteUser,
      createPost,
      changePost,
      deletePost,
      createProfile,
      changeProfile,
      deleteProfile,
      subscribeTo,
      unsubscribeFrom
    },
  }),
});
