import { Suspense } from "react";
import PengajuanClientPage from "./PengajuanClientPage";

export default function PengajuanPage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-center text-lg text-slate-700">Memuat data...</div>}
    >
      <PengajuanClientPage />
    </Suspense>
  );
}
