import { useQuery } from "@tanstack/react-query";
import { useDataLayer } from "../use-data-layer/use-data-layer";

interface Props {
  trailId: string;
}

export function useGetTrail({ trailId }: Props) {
  const { action, isLoading } = useDataLayer({
    action: "getTrail",
  });

  const { data, isPending: isLoadingGetTrail } = useQuery({
    queryKey: ["trail", trailId],
    queryFn: async () => {
      if (!action) return null;

      const { trail } = await action({ trailId });

      return trail;
    },
  });

  return {
    data,
    isLoading: isLoading || isLoadingGetTrail,
  };
}
