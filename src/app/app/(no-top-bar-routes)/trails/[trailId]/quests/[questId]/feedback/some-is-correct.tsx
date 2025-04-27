import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "../question-store";

const ABOVE_50_PERCENTAGE_MESSAGE =
  "UUUUUH! Passou muito perto! Mas você acertou quase todas! Tente novamente!";
const BELOW_50_PERCENTAGE_MESSAGE =
  "Hmmm... Você acertou poucas questões. Mas não desista! Tente novamente!";

function describeArc(percentage: number): string {
  // Convert percentage to angle (0-100% -> 0-360 degrees)
  const angle = (percentage / 100) * 360;

  // Calculate start and end points
  const startAngle = 90; // Start from top
  const endAngle = startAngle + angle;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const radius = 9;
  const startX = 12 + radius * Math.cos(startRad);
  const startY = 12 + radius * Math.sin(startRad);
  const endX = 12 + radius * Math.cos(endRad);
  const endY = 12 + radius * Math.sin(endRad);

  const largeArcFlag = angle > 180 ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
}

interface Props {
  percentage: number;
  trailId: string;
  questId: string;
  firstQuestionId: string;
}

export function SomeIsCorrectFeedback({
  percentage,
  trailId,
  questId,
  firstQuestionId,
}: Props) {
  const { reset } = useQuestionStore();
  const router = useRouter();
  const message =
    percentage > 50 ? ABOVE_50_PERCENTAGE_MESSAGE : BELOW_50_PERCENTAGE_MESSAGE;

  function handleTryAgain() {
    reset();
    router.push(
      `/app/trails/${trailId}/quests/${questId}?questionId=${firstQuestionId}`
    );
  }

  function handleGoBack() {
    reset();
    router.push(`/app/trails/${trailId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-4 items-center justify-center relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            className="stroke-muted-foreground/10"
            strokeWidth="2"
            fill="none"
          />
          <path
            d={describeArc(percentage)}
            className={percentage > 50 ? "stroke-green-500" : "stroke-red-500"}
            strokeWidth="2"
          />
        </svg>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-lg md:text-xl">{percentage}% de acertos</h1>
          <p className="text-muted-foreground text-sm md:text-base text-center">
            {message}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="cursor-pointer" onClick={handleTryAgain}>
          Tentar novamente
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handleGoBack}
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
}
