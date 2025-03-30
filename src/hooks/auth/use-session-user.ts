import { useQuery } from "@tanstack/react-query";
import { getSessionUser } from "@/api/user/get-session-user";

export function useSessionUser() {
  return useQuery({
    queryKey: ["session-user"],
    queryFn: getSessionUser,
  });
}
