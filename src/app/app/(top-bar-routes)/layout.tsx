import { TopBar } from "@/components/top-bar/top-bar";

export default function TopBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
}
