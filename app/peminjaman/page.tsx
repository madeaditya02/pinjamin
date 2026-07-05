"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

dayjs.locale("id");

type Item = {
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

const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function PeminjamanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Item[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({});
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
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
      .get("/organisasi/pengajuan", {
        params: {
          page,
          limit,
          search: search || undefined,
          status: status || undefined,
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
  }, [page, search, status]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    router.replace(`/peminjaman${params.toString() ? `?${params}` : ""}`);
  }, [page, router, search, status]);

  const pages = useMemo(() => {
    const output: number[] = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i += 1) output.push(i);
    return output;
  }, [totalPages]);

  return (
    <DashboardLayout title="Kelola Peminjaman">
      <div className="space-y-6">
        <div>
          <h2 className="text-[31px] font-bold text-slate-800">Kelola Peminjaman</h2>
          <p className="mt-1 text-[16px] text-slate-600">
            Review dan kelola semua pengajuan peminjaman organisasi Anda.
          </p>
        </div>

        <Card className="overflow-hidden">
          {/* <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5dbef] px-6 py-5">
            <div className="flex min-w-[320px] max-w-[420px] flex-1 items-center rounded-[4px] border border-[#c7cfe7] bg-white px-3 py-2.5">
              <FiSearch className="mr-2 text-[20px] text-slate-500" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Cari berdasarkan alasan atau tanggal..."
                className="w-full border-0 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => {
                    setPage(1);
                    setStatus(event.target.value);
                  }}
                  className="h-10 min-w-[160px] rounded-[4px] border border-[#c7cfe7] bg-white px-4 text-[15px] text-slate-700 outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value || "all"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setSearch("");
                  setStatus("");
                }}
                className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-[#c7cfe7] bg-white px-4 text-[15px] text-slate-700"
              >
                <FiFilter />
                Filter
              </button>
            </div>
          </div> */}

          {loading ? (
            <div className="space-y-3 p-6">
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
            </div>
          ) : (
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
                    {(data.length ? data : []).map((item) => (
                      <tr key={item.id} className="border-t border-[#dfe4f2]">
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item.tanggal_mulai ? dayjs(item.tanggal_mulai).format("D MMM YYYY") : "-"}
                        </td>
                        <td className="px-6 py-6 text-[16px] text-slate-700">
                          {item.tanggal_selesai ? dayjs(item.tanggal_selesai).format("D MMM YYYY") : "-"}
                        </td>
                        <td className="px-6 py-6">
                          <Badge
                            tone={
                              item.status === "approved"
                                ? "success"
                                : item.status === "rejected"
                                  ? "danger"
                                  : item.status === "returned"
                                    ? "info"
                                    : "warning"
                            }
                            className="normal-case tracking-normal"
                          >
                            {item.status ?? "-"}
                          </Badge>
                        </td>
                        <td className="px-6 py-6 text-[16px] text-slate-700">{item.alasan ?? "-"}</td>
                        <td className="px-6 py-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/peminjaman/${item.id}`}
                              className="inline-flex h-9 items-center rounded-[4px] bg-[#155dfc] px-4 text-[15px] font-medium text-white"
                            >
                              Review
                            </Link>
                            {item.status === "approved" ? (
                              <Link
                                href={`/peminjaman/${item.id}/return`}
                                className="inline-flex h-9 items-center rounded-[4px] border border-[#155dfc] bg-white px-4 text-[15px] font-medium text-[#155dfc]"
                              >
                                Kembalikan
                              </Link>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe4f2] px-6 py-4 text-[15px] text-slate-600">
                <span>
                  Menampilkan {data.length} dari {meta.total ?? 0} peminjaman
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex h-9 items-center gap-1 rounded-[4px] border border-[#c7cfe7] bg-white px-3 disabled:opacity-40"
                  >
                    <FiChevronLeft />
                  </button>
                  {pages.map((value) => (
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
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
