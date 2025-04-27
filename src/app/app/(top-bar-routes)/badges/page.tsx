"use client";

import { BadgeList } from "./badge-list";

export default function Page() {
  return (
    <div className="min-h-screen w-full px-4 py-32">
      <div className="text-left mb-8">
        <h1 className="text-3xl">Badges</h1>
      </div>
      <BadgeList />
    </div>
  );
}
