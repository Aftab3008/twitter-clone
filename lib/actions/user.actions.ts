"use server";

import { CreateUserProps, UpdateParams, UpdateUserParams } from "@/types";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { handleError } from "../utils";
import { createNotification } from "./notifications.actions";
import Post from "../database/models/posts.model";
import Notification from "../database/models/notifications.model";
import { ObjectId } from "mongodb";

export async function createUser({
  username,
  fullName,
  email,
  imgUrl,
  clerkId,
}: CreateUserProps) {
  try {
    await connectToDatabase();
    const newUser = await User.create({
      username,
      fullName,
      email,
      imgUrl,
      clerkId,
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function updateByUsername(username: string, user: UpdateParams) {
  try {
    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      user,
      {
        new: true,
      }
    );
    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserProfile(username: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserSuggetions(id: string) {
  try {
    await connectToDatabase();
    const userFollowedbyMe = await User.findOne({ _id: id }).select(
      "following"
    );
    const suggestions = await User.aggregate([
      { $match: { _id: { $ne: new ObjectId(id) } } },
      { $match: { _id: { $nin: userFollowedbyMe?.following || [] } } },
      { $sample: { size: 6 } },
    ]);
    return JSON.parse(JSON.stringify(suggestions));
  } catch (error) {
    handleError(error);
  }
}

export async function followUser(username: string, userToFollow: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });
    const userToModify = await User.findOne({ username: userToFollow });
    if (!user || !userToModify) throw new Error("User not found");

    let message;
    if (user.following.includes(userToModify._id)) {
      user.following = user.following.filter(
        (id: string) => id !== userToModify._id
      );
      userToModify.followers = userToModify.followers.filter(
        (id: string) => id !== user._id
      );
      message = `You have unfollowed ${userToFollow}.`;
    } else {
      user.following.push(userToModify._id);
      userToModify.followers.push(user._id);
      message = `You are now following ${userToFollow}.`;
      const notification = await createNotification(
        user._id.toString(),
        userToModify._id.toString(),
        "follow"
      );
    }

    await user.save();
    await userToModify.save();
    return { user: JSON.parse(JSON.stringify(user)), message };
  } catch (error) {
    handleError(error);
  }
}

export async function getUserbyclerkId(clerkId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: clerkId });
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserbyId(id: string) {
  try {
    await connectToDatabase();
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function getonlyUserId(clerkId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId }).select("_id");
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");
    const deletePost = await Post.deleteMany({ authorId: user._id });
    const deleteNotifications = await Notification.deleteMany({
      $or: [{ from: user._id }, { to: user._id }],
    });
    await User.findByIdAndDelete(user._id);
  } catch (error) {
    handleError(error);
  }
}
