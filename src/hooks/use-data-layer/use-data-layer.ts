import { useSessionUser } from "../auth/use-session-user";
import { TrailActionKeys } from "./types";
import { TrailActions } from "@/entities/trail-actions";
import { clientActions } from "./client-actions";
import { serverActions } from "./server-actions";

interface DataLayerResult<K extends TrailActionKeys> {
  isLoading: boolean;
  action: TrailActions[K] | null;
}

export function useDataLayer<K extends TrailActionKeys>({
  action,
}: {
  action: K;
}): DataLayerResult<K> {
  const { data: user, isLoading: isLoadingUser } = useSessionUser();

  if (isLoadingUser)
    return {
      isLoading: true,
      action: null,
    };

  if (!user)
    return {
      isLoading: false,
      action: clientActions[action],
    };

  return {
    isLoading: false,
    action: serverActions[action],
  };
}
