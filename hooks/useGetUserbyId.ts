import { getUserbyId } from "@/lib/actions/user.actions";
import { Usertypes } from "@/types";
import { useEffect, useState } from "react";

export const useGetUserbyId = (id: string) => {
  const [user, setUser] = useState<Usertypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await getUserbyId(id);
        setUser(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  return { user, loading, error };
};
