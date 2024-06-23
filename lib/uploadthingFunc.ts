"use server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deletefiles(url: string) {
  try {
    await utapi.deleteFiles(url);
  } catch (error) {
    console.error(error);
  }
}
