"use client";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import ProfileHeaderSkeleton from "@/components/shared/skeletons/ProfileHeaderSkeleton";
import Link from "next/link";
import { POSTS } from "@/constants/dummy";
import EditProfileModal from "@/components/shared/EditProfileModal";
import Posts from "@/components/shared/Posts";
import { useGetProfile } from "@/hooks/useGetProfile";
import {
  convertFileToUrl,
  formatMemberSinceDate,
  handleError,
} from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useUploadThing } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { updateByUsername } from "@/lib/actions/user.actions";
import { Loader } from "lucide-react";
import { Usertypes } from "@/types";
import { useGetPosts } from "@/hooks/useGetPosts";

type UserData = {
  user: Usertypes | null;
  loading: boolean;
  error: string | null;
};

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { startUpload } = useUploadThing("imageUploader");
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [profileImgFile, setProfileImgFile] = useState<File | null>(null);
  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
  const [feedType, setFeedType] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const coverImgRef = useRef<HTMLInputElement | null>(null);
  const profileImgRef = useRef<HTMLInputElement | null>(null);
  const [{ user, loading, error }, setUserData] = useState<UserData>({
    user: null,
    loading: true,
    error: null,
  });
  const { posts } = useGetPosts("", params.username);

  const {
    user: profileUser,
    loading: isLoading,
    error: profileError,
  } = useGetProfile(params.username);
  const { user: currentUser } = useUser();
  const isMyProfile = currentUser?.username === params.username;
  useEffect(() => {
    setUserData({
      user: profileUser,
      loading: isLoading,
      error: profileError,
    });
  }, [profileUser, isLoading, profileError]);

  async function updateProfile() {
    try {
      let profileImgUrl = null;
      let coverImgUrl = null;
      setIsEditing(true);
      if (profileImgFile) {
        profileImgUrl = await startUpload([profileImgFile]);
        if (!profileImgUrl) {
          toast.error("Failed to upload profile image");
          return;
        }
      }
      if (coverImgFile) {
        coverImgUrl = await startUpload([coverImgFile]);
        if (!coverImgUrl) {
          toast.error("Failed to upload cover image");
          return;
        }
      }
      const updatedUser = await updateByUsername(params.username, {
        imgUrl: profileImgUrl?.[0]?.url,
        coverImgUrl: coverImgUrl?.[0]?.url,
      });
      if (!updatedUser) {
        toast.error("Failed to update profile");
      } else {
        setUserData({ user: updatedUser, loading: false, error: null });
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setProfileImg(null);
      setCoverImg(null);
      setCoverImgFile(null);
      setProfileImgFile(null);
      setIsEditing(false);
    }
  }

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {isLoading && <ProfileHeaderSkeleton />}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link href="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {posts?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImgUrl || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current?.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={coverImgRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCoverImg(convertFileToUrl(file));
                      setCoverImgFile(file);
                    }
                  }}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImg(convertFileToUrl(file));
                      setProfileImgFile(file);
                    }
                  }}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg || user?.imgUrl || "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current?.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => alert("Followed successfully")}
                  >
                    Follow
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={updateProfile}
                    disabled={isEditing}
                  >
                    {isEditing ? (
                      <Loader color="white" className="animate-spin" />
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          youtube.com/@asaprogrammer_
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {formatMemberSinceDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-1" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-blue-1" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts username={params.username} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
