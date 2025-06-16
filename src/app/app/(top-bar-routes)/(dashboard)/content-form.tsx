"use client";

import { generateTrailTaskTrigger } from "@/api/trails/generate-trail-task";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useIsEarlyAdopter } from "@/hooks/auth/use-is-early-adopter";
import { extractContents } from "@/lib/content/extract-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Send, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTrailRunnerStore } from "./trail-runner-store";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useListTrails } from "@/hooks/trails/use-list-trails";

const webSummitUrl = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_URL as string;

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

export function ContentForm() {
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

  return (
    <Form {...form}>
      <form
        className="space-y-2 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <BecomeEarlyAdopterDialog open={open} onOpenChange={setOpen} />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  onClick={() => {
                    if (!isAuthenticated) return;
                    if (!isEarlyAdopter) {
                      setOpen(true);
                    }
                  }}
                  className="relative flex items-start gap-2 w-full border rounded-md p-2 shadow"
                >
                  <Textarea
                    placeholder={placeholder}
                    className={`text-sm [&::-webkit-resizer]:hidden [&::-webkit-scrollbar]:hidden min-h-[40px] max-h-[200px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none ${
                      field.value ? "resize-y" : "resize-none"
                    }`}
                    {...field}
                    disabled={submitDisabled}
                  />

                  <div className="flex items-center min-h-[40px]">
                    <Button
                      disabled={submitDisabled}
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
                      {isAuthenticated && isEarlyAdopter ? <Send /> : <Lock />}
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

function BecomeEarlyAdopterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Early Adopter Program</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Become an early adopter and help us shape the future of education.
        </DialogDescription>
        <div className="w-full flex items-center justify-center">
          <Link
            className={buttonVariants({
              variant: "outline",

              className:
                "shadow-[#8fd18b] shadow-sm text-[#8fd18b] h-auto text-center",
            })}
            href={webSummitUrl}
          >
            Become an early adopter
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
