"use client";

import { generateTrailTaskTrigger } from "@/api/trails/generate-trail-task";
import { useTrailRunnerStore } from "./trail-runner-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { extractContents } from "@/lib/content/extract-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Upload, X } from "lucide-react";
import { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    topic: z.string().optional(),
    files: z
      .array(z.instanceof(File))
      .max(3, "Máximo de 3 arquivos permitidos")
      .optional(),
  })
  .refine(
    (data) => {
      // Pelo menos um dos campos deve estar preenchido
      return (
        (!!data.topic && data.topic.trim() !== "") ||
        (data.files && data.files.length > 0)
      );
    },
    {
      message: "É necessário fornecer um tópico ou pelo menos um arquivo",
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function ContentForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setContents, setRunId, setAccessToken } = useTrailRunnerStore();

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
  const submitDisabled = !contents && !files;

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

  return (
    <Form {...form}>
      <form
        className="space-y-2 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-start gap-2 w-full border rounded-md p-2 shadow">
                  <Textarea
                    placeholder="Qual conteúdo vamos validar hoje?"
                    className={`[&::-webkit-resizer]:hidden [&::-webkit-scrollbar]:hidden min-h-[40px] max-h-[200px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none ${
                      field.value ? "resize-y" : "resize-none"
                    }`}
                    {...field}
                  />

                  <div className="flex items-center min-h-[40px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <Upload />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="submit"
                      disabled={submitDisabled}
                      className="cursor-pointer"
                    >
                      <Send />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input {...getInputProps()} ref={inputRef} />

        <div className="flex gap-2 h-6">
          {files?.map((file) => (
            <div
              className="flex items-center text-sm gap-2 pl-2 border rounded-md w-fit bg-secondary h-6"
              key={file.name}
            >
              <p className="text-xs">{file.name}</p>
              <button
                type="button"
                onClick={() => handleRemoveFile(file)}
                className="text-muted-foreground hover:text-foreground cursor-pointer pr-1 duration-200 h-6"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
}
