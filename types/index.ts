export type CreateUserProps = {
  username: string;
  fullName: string;
  email: string;
  imgUrl: string;
  clerkId: string;
};

export type UpdateUserParams = {
  username?: string;
  fullName?: string;
  email?: string;
  imgUrl?: string;
};

export type UpdateParams = {
  fullName?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  link?: string;
};

export interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  followers: string[];
  following: string[];
  imgUrl: string;
  coverImgUrl: string;
  bio: string;
  link: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}
