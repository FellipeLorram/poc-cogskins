"use client";

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
import { Lock, Send, Upload, X } from "lucide-react";
import Link from "next/link";
import { useContentForm } from "./use-content-form";

const webSummitUrl = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_URL as string;

export function ContentForm() {
  const {
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
    submit,
    removeFile,
  } = useContentForm();

  return (
    <Form {...form}>
      <form className="space-y-2 w-full" onSubmit={form.handleSubmit(submit)}>
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
                    if (!isLimited) {
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
                      {isAuthenticated && isLimited ? <Send /> : <Lock />}
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
                onClick={() => removeFile(file)}
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
