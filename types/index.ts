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
  imgUrl?: string;
  coverImgUrl?: string;
  bio?: string;
  link?: string;
};

export interface Usertypes {
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

export interface Comment {
  text: string;
  user: string;
}

export interface Author {
  _id: string;
  fullName: string;
  username: string;
  imgUrl: string;
  clerkId: string;
  email?: string;
  followers?: string[];
  following?: string[];
  bio?: string;
  link?: string;
  coverImgUrl?: string;
}

export interface Posttypes {
  _id: string;
  authorId: Author;
  text?: string;
  postImg?: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
