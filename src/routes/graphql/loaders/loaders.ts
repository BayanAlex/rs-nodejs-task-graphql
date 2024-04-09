import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { IMemberType, IPost, IProfile, IUser } from "../models/models.js";

export interface Loaders {
  users: DataLoader<string, IUser, string>,
  posts: DataLoader<string, IPost[], string>,
  profiles: DataLoader<string, IProfile | null, string>,
  memberTypes: DataLoader<string, IMemberType, string>,
  userSubscribedTo: DataLoader<string, IUser[] | null, string>,
  subscribedToUser: DataLoader<string, IUser[] | null, string>,
}

export function genLoaders(context: PrismaClient): Loaders {

  const usersLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await context.user.findMany({ 
      where: { id: { in: [...ids] } }, 
      include: { 
        subscribedToUser: true, 
        userSubscribedTo: true 
      } 
    });
    const usersById = users.reduce((res: { [key: string]: IUser }, user: IUser) => {
      res[user.id] = user;
      return res;
    }, {});
    
    return ids.map((id) => usersById[id]);
  });

  const postsLoader = new DataLoader(async (ids: readonly string[]) => {
    const allPosts = await context.post.findMany({ where: { authorId: { in: [...ids] } } });
    const postsByUser = allPosts.reduce((res: { [key: string]: IPost[] }, post: IPost) => {
      if (res[post.authorId]) {
        res[post.authorId].push(post);
      } else {
        res[post.authorId] = [post];
      }
      return res;
    }, {});
    
    return ids.map((id) => postsByUser[id]);
  });

  const profilesLoader = new DataLoader(async (ids: readonly string[]) => {
    const profiles = await context.profile.findMany({ where: { userId: { in: [...ids] } } });
    const profilesByUser = profiles.reduce((res: { [key: string]: IProfile }, profile: IProfile) => {
      res[profile.userId] = profile;
      return res;
    }, {});
    
    return ids.map((id) => profilesByUser[id]);
  });

  const memberTypesLoader = new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await context.memberType.findMany({ where: { id: { in: [...ids] } } });
    const memberTypesById = memberTypes.reduce((res: { [key: string]: IMemberType }, memberType: IMemberType) => {
      res[memberType.id] = memberType;
      return res;
    }, {});
    
    return ids.map((id) => memberTypesById[id]);
  });

  const userSubscribedToLoader = new DataLoader(async (ids: readonly string[]) => {
    return ((await usersLoader.loadMany(ids)) as IUser[])
      .map((user) => user.userSubscribedTo?.map((sub) => sub.authorId))
      .map((subs) => (subs ? usersLoader.loadMany(subs) : []) as IUser[]);
  });
  
  const subscribedToUserLoader = new DataLoader(async (ids: readonly string[]) => {
    return ((await usersLoader.loadMany(ids)) as IUser[])
      .map((user) => user.subscribedToUser?.map((sub) => sub.subscriberId))
      .map((subs) => (subs ? usersLoader.loadMany(subs) : []) as IUser[]);
  });

  return {
    users: usersLoader,
    posts: postsLoader,
    profiles: profilesLoader,
    memberTypes: memberTypesLoader,
    userSubscribedTo: userSubscribedToLoader,
    subscribedToUser: subscribedToUserLoader
  }
}
