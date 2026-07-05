import { Suspense } from "react";
import InventarisClientPage from "./InventarisClientPage";

export default function InventarisPage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-center text-lg text-slate-700">Memuat data...</div>}
    >
      <InventarisClientPage />
    </Suspense>
  );
}
