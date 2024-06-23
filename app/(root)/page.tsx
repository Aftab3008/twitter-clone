"use client";

import CreatePost from "@/components/shared/CreatePost";
import CreatePostZod from "@/components/shared/CreatePostZod";
import Posts from "@/components/shared/Posts";
import { useState } from "react";

export default function Home() {
  const [feedType, setFeedType] = useState("forYou");
  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-blue-1"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-blue-1"></div>
            )}
          </div>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePostZod />

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
}
