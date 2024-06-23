"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "../database";
import Post from "../database/models/posts.model";
import { handleError } from "../utils";
import { createNotification } from "./notifications.actions";
import { utapi } from "../uploadthingFunc";

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
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    handleError(error);
  }
}

export async function deletePost(postId: string) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (post?.postImg) {
      utapi.deleteFiles(post.postImg);
    }
    await Post.findByIdAndDelete(postId);
    return { statusCode: "ok", message: "Post deleted successfully" };
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
      post.likes = post.likes.filter((id) => id.toString() !== userId);
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
