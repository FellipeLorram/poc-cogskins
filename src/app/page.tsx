"use client";

import { generateTrail } from "@/api/trails/generate-trail";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const { mutate } = useMutation({
    mutationFn: generateTrail,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("content") as string;
    mutate({ contents: [content] });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
        <input type="text" name="content" />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
