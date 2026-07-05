import { Suspense } from "react";
import PeminjamanClientPage from "./PeminjamanClientPage";

export default function PeminjamanPage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-center text-lg text-slate-700">Memuat data...</div>}
    >
      <PeminjamanClientPage />
    </Suspense>
  );
}
