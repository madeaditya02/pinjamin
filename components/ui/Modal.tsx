"use client";

import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, footer, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-2xl rounded-[8px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#d5dbef] px-6 py-4">
          <h3 className="text-[24px] font-bold text-slate-800">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-500">
            <FiX className="text-[22px]" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-[#d5dbef] px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
