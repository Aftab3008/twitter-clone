import { getUserbyId } from "@/lib/actions/user.actions";
import { Usertypes } from "@/types";
import { useState, useEffect } from "react";

export const useGetUser = (clerkId: string) => {
  const [user, setUser] = useState<Usertypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await getUserbyId(clerkId);
        setUser(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clerkId) {
      fetchUser();
    }
  }, [clerkId]);

  return { user, loading, error };
};
