import { generateTrail } from "@/api/trails/generate-trail";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const generateTrailSchema = z.object({
  contents: z.array(z.string()).min(1).max(4),
});

export const generateTrailTask = schemaTask({
  id: "trail-generate",
  maxDuration: 300,
  schema: generateTrailSchema,
  run: async (payload, { ctx }) => {
    logger.log("Generating trail...", { payload, ctx });

    const trail = await generateTrail({ contents: payload.contents });

    return {
      trail,
    };
  },
});
