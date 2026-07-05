"use client";

import { FiAlertTriangle } from "react-icons/fi";

type AlertProps = {
  message: string;
};

export function Alert({ message }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700"
    >
      <span className="mt-0.5 text-red-600">
        <FiAlertTriangle />
      </span>
      <p className="leading-6">{message}</p>
    </div>
  );
}
