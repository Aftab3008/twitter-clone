import { getPosts } from "@/lib/actions/posts.actions";
import { useEffect, useState } from "react";
import { Posttypes } from "@/types";

export const useGetPosts = (feedType?: string, username?: string) => {
  const [posts, setPosts] = useState<Posttypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const postsData = await getPosts(feedType, username);
        setPosts(postsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [feedType, username]);

  return { posts, loading, error };
};
