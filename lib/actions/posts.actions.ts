"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "../database";
import Post from "../database/models/posts.model";
import { handleError, removePrefix } from "../utils";
import { createNotification } from "./notifications.actions";
import { deletefiles } from "../uploadthingFunc";
import User from "../database/models/user.model";
import { revalidatePath } from "next/cache";

interface CreatePostProps {
  authorId: string;
  text: string;
  postImg?: string;
}

export async function createPost({ authorId, text, postImg }: CreatePostProps) {
  try {
    await connectToDatabase();
    const newPost = await Post.create({
      authorId,
      text,
      postImg,
    });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    handleError(error);
  }
}

export async function deletePost(postId: string) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post?.postImg) {
      const imageUrl = removePrefix(post.postImg);
      await deletefiles(imageUrl);
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    return JSON.parse(JSON.stringify(deletedPost));
  } catch (error) {
    handleError(error);
  }
}

export async function commentonPost(
  postId: string,
  text: string,
  userId: string
) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    post.comments.push({ text, user: userId });
    await post.save();
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    handleError(error);
  }
}

export async function likeOrUnlikePost(postId: string, userId: string) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const isLiked = post.likes.includes(new mongoose.Types.ObjectId(userId));
    if (isLiked) {
      post.likes = post.likes.filter((id: string) => id.toString() !== userId);
    } else {
      post.likes.push(new mongoose.Types.ObjectId(userId));
      await createNotification(
        userId,
        post.authorId.toString(),
        "like",
        "liked your post"
      );
    }
    await post.save();
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    handleError(error);
  }
}

export async function getPosts(feedType?: string, username?: string) {
  try {
    await connectToDatabase();
    let posts;
    if (username) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      posts = await Post.find({ authorId: user._id })
        .sort({ createdAt: -1 })
        .populate(
          "authorId",
          "fullName username imgUrl clerkId email followers following bio link coverImgUrl"
        );
    } else {
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("authorId", "fullName username imgUrl clerkId");
    }
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    handleError(error);
  }
}
