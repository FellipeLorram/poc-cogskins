"use client";

import { generateTrailTaskTrigger } from "@/api/trails/generate-trail-task";
import { useIsEarlyAdopter } from "@/hooks/auth/use-is-early-adopter";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useListTrails } from "@/hooks/trails/use-list-trails";
import { extractContents } from "@/lib/content/extract-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTrailRunnerStore } from "./trail-runner-store";

const formSchema = z
  .object({
    topic: z.string().optional(),
    files: z
      .array(z.instanceof(File))
      .max(3, "Maximum of 3 files allowed")
      .optional(),
  })
  .refine(
    (data) => {
      // At least one of the fields must be filled
      return (
        (!!data.topic && data.topic.trim() !== "") ||
        (data.files && data.files.length > 0)
      );
    },
    {
      message: "You must provide a topic or at least one file",
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function useContentForm() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setContents, setRunId, setAccessToken } = useTrailRunnerStore();

  const { data: isEarlyAdopter, isPending: isEarlyAdopterLoading } =
    useIsEarlyAdopter();
  const { data: sessionUser, isPending: isSessionUserLoading } =
    useSessionUser();
  const { data: trails = [], isPending: isTrailsLoading } = useListTrails();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      files: [],
    },
  });

  const { getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt", ".md"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    noDrag: true,
    maxFiles: 2,
    onDrop: (acceptedFiles) => {
      form.setValue("files", acceptedFiles);
    },
  });

  const files = form.watch("files");
  const contents = form.watch("topic");

  // Lógica de limitação
  const isLoading =
    isEarlyAdopterLoading || isSessionUserLoading || isTrailsLoading;
  const isAuthenticated = !!sessionUser;
  const isLimited = !isEarlyAdopter && trails.length >= 3;
  const submitDisabled =
    isLoading ||
    !isAuthenticated ||
    (!contents && !files) ||
    (!isEarlyAdopter && trails.length >= 3);

  // Mensagem de placeholder dinâmica
  let placeholder = "What content shall we validate today?";
  if (!isAuthenticated) {
    placeholder = "Log in to generate trails";
  } else if (isLimited) {
    placeholder =
      "You have reached the limit of 3 trails. Become an early adopter to create more.";
  }

  function handleRemoveFile(file: File) {
    form.setValue(
      "files",
      files?.filter((f) => f !== file)
    );
  }

  async function handleSubmit(values: FormValues) {
    const contents: string[] = [];

    if (values.topic) {
      contents.push(values.topic);
    }

    if (values.files) {
      const extractedContents = await extractContents(values.files);

      if (extractedContents.success) {
        contents.push(...extractedContents.contents);
      }
    }

    form.reset({
      topic: "",
      files: [],
    });
    setContents(contents);
    const { accessToken, runId } = await generateTrailTaskTrigger({
      contents,
    });

    setAccessToken(accessToken);
    setRunId(runId);
  }

  return {
    open,
    form,
    files,
    inputRef,
    isLimited,
    placeholder,
    submitDisabled,
    isAuthenticated,
    setOpen,
    getInputProps,
    submit: handleSubmit,
    removeFile: handleRemoveFile,
  };
}
