import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  label?: string;
};

export function Input({ icon, label, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-[15px] font-medium text-slate-700">
          {label}
        </span>
      ) : null}
      <div className="flex items-center rounded-[5px] border border-[#c9d0eb] bg-white px-3 py-3 text-slate-700 transition focus-within:border-[#155dfc]">
        {icon ? <span className="mr-3 text-lg text-slate-500">{icon}</span> : null}
        <input
          className={`w-full border-0 bg-transparent text-[15px] outline-none placeholder:text-slate-400 ${className}`}
          {...props}
        />
      </div>
    </label>
  );
}
