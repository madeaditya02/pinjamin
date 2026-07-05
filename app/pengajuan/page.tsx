"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiDownload, FiFilter, FiPlus, FiSearch } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

type PengajuanItem = {
  id: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status?: string;
  alasan?: string;
  items?: Array<{ inventaris_id?: number; jumlah_dipinjam?: number }>;
};

export default function PengajuanPage() {
  const [data, setData] = useState<PengajuanItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get("/pengajuan/me")
      .then((response) => {
        if (!active) return;
        setData(response.data?.data?.data ?? response.data?.data ?? []);
      })
      .catch(() => {
        if (!active) return;
        setData([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return data.filter((item) =>
      [item.status, item.alasan, item.tanggal_mulai, item.tanggal_selesai]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [data, search]);

  return (
    <DashboardLayout title="Riwayat Peminjaman">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[31px] font-bold text-slate-800">Riwayat Peminjaman</h2>
            <p className="mt-1 text-[16px] text-slate-600">
              Lacak dan kelola semua pengajuan peminjaman aset Anda.
            </p>
          </div>
          <Link
            href="/pengajuan/tambah"
            className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-[#155dfc] px-4 text-[15px] font-medium text-white"
          >
            <FiPlus />
            Ajukan Peminjaman
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5dbef] px-6 py-5">
            {/* <div className="flex min-w-[320px] max-w-[420px] flex-1 items-center rounded-[4px] border border-[#c7cfe7] bg-white px-3 py-2.5">
              <FiSearch className="mr-2 text-[20px] text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari berdasarkan alasan atau status..."
                className="w-full border-0 outline-none placeholder:text-slate-400"
              />
            </div> */}
            <div className="flex gap-2 items-center">
              Filter by status :
              <button className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-[#c7cfe7] bg-white px-4 text-[15px] text-slate-700">
                <FiFilter />
                Filter
              </button>
              {/* <button className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-[#c7cfe7] bg-white px-4 text-[15px] text-slate-700">
                <FiDownload />
                Ekspor
              </button> */}
            </div>
          </div>
          {
            filtered.length > 0 ? (
              <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px]">
                  <thead className="bg-[#f0f3ff] text-[15px] text-slate-600">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Tanggal Pinjam</th>
                      <th className="px-6 py-4 text-left font-medium">Tanggal Selesai</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-left font-medium">Alasan</th>
                      <th className="px-6 py-4 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <tr key={item?.id ?? index} className="border-t border-[#dfe4f2]">
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item?.tanggal_mulai}
                        </td>
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item?.tanggal_selesai}
                        </td>
                        <td className="px-6 py-6">
                          <Badge
                            tone={
                              item?.status === "approved"
                                ? "success"
                                : item?.status === "dipinjam"
                                  ? "info"
                                  : item?.status === "menunggu"
                                    ? "warning"
                                    : item?.status === "ditolak"
                                      ? "danger"
                                      : "neutral"
                            }
                            className="normal-case tracking-normal"
                          >
                            {item?.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item?.alasan}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <Link href={`/pengajuan/${item.id}`} type="button" className="font-medium text-[#155dfc]">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[#dfe4f2] px-6 py-4 text-[15px] text-slate-600">
                <span>Menampilkan 1 - 5 dari 24 entri</span>
                <div className="flex items-center gap-2">
                  {["<", "1", "2", "3", "...", "5", ">"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`h-9 min-w-9 rounded-[4px] border px-3 ${
                        item === "1"
                          ? "border-[#155dfc] bg-[#155dfc] text-white"
                          : "border-[#c7cfe7] bg-white text-slate-600"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-600 text-lg">Tidak ada data.</div>
            )
          }
        </Card>
      </div>
    </DashboardLayout>
  );
}
