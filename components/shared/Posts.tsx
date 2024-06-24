import { POSTS } from "@/constants/dummy";
import PostSkeleton from "./skeletons/PostSkeleton";
import Post from "./Post";
import { useGetPosts } from "@/hooks/useGetPosts";
import { useUser } from "@clerk/nextjs";

const Posts = ({
  feedType,
  username,
}: {
  feedType?: string;
  username?: string;
}) => {
  const { posts, loading, error } = useGetPosts(feedType, username);
  const { user } = useUser();
  const currentUserId = user?.id;

  return (
    <>
      {loading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!loading && posts?.length === 0 && (
        <p className="text-center my-4">No posts done by you </p>
      )}
      {!loading && POSTS && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
