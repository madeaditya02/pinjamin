import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        {children}
      </div>
    </main>
  );
}
