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

export type CreatePostInput = Omit<IPost, 'id'>;
export type CreateUserInput = Pick<IUser, 'name' | 'balance'>;
export type CreateProfileInput = Omit<IProfile, 'id' | 'memberType'>;

export type ChangePostInput = Omit<CreatePostInput, 'authorId'>;
export type ChangeUserInput = CreateUserInput;
export type ChangeProfileInput = CreateProfileInput;