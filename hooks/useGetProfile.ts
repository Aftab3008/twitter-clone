import { getUserProfile } from "@/lib/actions/user.actions";
import { Usertypes } from "@/types";
import { useEffect, useState } from "react";

export const useGetProfile = (username: string) => {
  const [user, setUser] = useState<Usertypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getUserProfile(username);
        setUser(user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { user, loading, error };
};
