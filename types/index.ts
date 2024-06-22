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
