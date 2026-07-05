"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

dayjs.locale("id");

type PengajuanItem = {
  id: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status?: string;
  alasan?: string;
};

type PaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

export default function PengajuanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PengajuanItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({});
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
  const [loading, setLoading] = useState(true);

  const limit = 5;
  const totalPages = Math.max(1, Math.ceil((meta.total ?? 0) / (meta.limit ?? limit) || 1));

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    api
      .get("/pengajuan/me", {
        params: {
          page,
          limit,
        },
      })
      .then((response) => {
        if (!active) return;
        const payload = response.data?.data ?? response.data ?? {};
        setData(payload.data ?? payload ?? []);
        setMeta(payload.pagination ?? {});
      })
      .catch(() => {
        if (!active) return;
        setData([]);
        setMeta({});
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    router.replace(`/pengajuan${params.toString() ? `?${params}` : ""}`);
  }, [page, router]);

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
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5dbef] px-6 py-5" />

          {loading ? (
            <div className="space-y-3 p-6">
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
            </div>
          ) : data.length ? (
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
                    {data.map((item) => (
                      <tr key={item.id} className="border-t border-[#dfe4f2]">
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item.tanggal_mulai ? dayjs(item.tanggal_mulai).format("D MMM YYYY") : "-"}
                        </td>
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item.tanggal_selesai
                            ? dayjs(item.tanggal_selesai).format("D MMM YYYY")
                            : "-"}
                        </td>
                        <td className="px-6 py-6">
                          <Badge
                            tone={
                              item.status === "approved"
                                ? "success"
                                : item.status === "dipinjam"
                                  ? "info"
                                  : item.status === "pending"
                                    ? "warning"
                                    : item.status === "rejected"
                                      ? "danger"
                                      : "neutral"
                            }
                            className="normal-case tracking-normal"
                          >
                            {item.status ?? "-"}
                          </Badge>
                        </td>
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item.alasan ?? "-"}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <Link href={`/pengajuan/${item.id}`} className="font-medium text-[#155dfc]">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe4f2] px-6 py-4 text-[15px] text-slate-600">
                <span>Menampilkan {data.length} data{meta.total ? ` dari ${meta.total} entri` : ""}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex h-9 items-center gap-1 rounded-[4px] border border-[#c7cfe7] bg-white px-3 disabled:opacity-40"
                  >
                    <FiChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .slice(0, 5)
                    .map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPage(value)}
                        className={`h-9 min-w-9 rounded-[4px] border px-3 ${
                          value === page
                            ? "border-[#155dfc] bg-[#155dfc] text-white"
                            : "border-[#c7cfe7] bg-white text-slate-600"
                        }`}
                      >
                        {value}
                      </button>
                    ))}

                  {totalPages > 5 ? <span className="px-1 text-slate-500">...</span> : null}

                  {totalPages > 5 ? (
                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className={`h-9 min-w-9 rounded-[4px] border px-3 ${
                        page === totalPages
                          ? "border-[#155dfc] bg-[#155dfc] text-white"
                          : "border-[#c7cfe7] bg-white text-slate-600"
                      }`}
                    >
                      {totalPages}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="inline-flex h-9 items-center gap-1 rounded-[4px] border border-[#c7cfe7] bg-white px-3 disabled:opacity-40"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-600 text-lg">Tidak ada data.</div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
