import { getSessionUser } from "@/api/user/get-session-user";
import { useQuery } from "@tanstack/react-query";

export function useIsEarlyAdopter() {
  return useQuery({
    queryKey: ["is-early-adopter"],
    queryFn: async () => {
      const user = await getSessionUser();
      if (!user) return false;

      return user.isEarlyAdopter;
    },
  });
}
