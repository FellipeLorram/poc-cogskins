export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
