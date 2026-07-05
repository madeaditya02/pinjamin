import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[4px] border border-[#c8d0eb] bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.4)] ${className}`}
      {...props}
    />
  );
}
