import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeFeedbackTaskRunner } from "./use-realtime-feedback-task-runner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  accessToken: string;
  runId: string;
}

export function PersonalizedFeedback({ accessToken, runId }: Props) {
  const { isGenerating, error, feedback } = useRealtimeFeedbackTaskRunner({
    accessToken,
    runId,
  });

  if (isGenerating) return <PersonalizedFeedbackSkeleton />;
  if (error) return null;

  return (
    <div className="py-16 border-t space-y-8">
      <div>
        <h1 className="text-2xl">{feedback?.encouragement}</h1>
        <p className="text-muted-foreground">{feedback?.conceptualFeedback}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dicas para melhorar</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {feedback?.nextStepHints.map((hint) => <li key={hint}>{hint}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pontos de melhoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {feedback?.improvementAreas.map((area) => (
            <div key={area.concept}>
              <h2 className="text-lg font-medium">{area.concept}</h2>
              <p>{area.suggestion}</p>
              <div className="space-y-2 p-4 border rounded-md mt-4 bg-accent">
                <p className="text-sm font-medium">Recursos:</p>
                <ul className="list-disc list-inside">
                  {area.resources.map((resource) => (
                    <li key={resource}>
                      <Link
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {resource}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalizedFeedbackSkeleton() {
  return (
    <div className="py-16 border-t space-y-8">
      <div className="space-y-2">
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-1/3 h-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dicas para melhorar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-1/2 h-4" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pontos de melhoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="space-y-2" key={index}>
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
