"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

dayjs.locale("id");

type Item = {
  id: number;
  gambar_inventaris?: string | null;
  nama_inventaris?: string;
  jumlah_inventaris?: number;
  kondisi?: string;
  nama_kategori?: string;
  deskripsi_inventaris?: string;
};

type PaginationMeta = { page?: number; limit?: number; total?: number };

function fallbackImage(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.src =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%25' height='100%25' fill='%23e2e8f0'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='12'>No Image</text></svg>";
}

export default function InventarisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Item[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({});
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const limit = 5;
  const totalPages = Math.max(1, Math.ceil((meta.total ?? 0) / (meta.limit ?? limit) || 1));
  const pages = useMemo(() => Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1), [totalPages]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    api
      .get("/organisasi/inventaris", {
        params: { page, limit, search: search || undefined },
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
  }, [page, search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (search) params.set("search", search);
    router.replace(`/inventaris${params.toString() ? `?${params}` : ""}`);
  }, [page, router, search]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus inventaris ini?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/organisasi/inventaris/${id}`);
      setData((current) => current.filter((item) => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Suspense fallback={<div className="p-4 text-center text-lg text-slate-700">Memuat data...</div>}>
      <DashboardLayout title="Kelola Inventaris">
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[31px] font-bold text-slate-800">Kelola Inventaris</h2>
              <p className="mt-1 text-[16px] text-slate-600">
                Tambah, ubah, dan hapus inventaris organisasi.
              </p>
            </div>
            <Link
              href="/inventaris/tambah"
              className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-[#155dfc] px-4 text-[15px] font-medium text-white"
            >
              <FiPlus />
              Tambah Barang
            </Link>
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5dbef] px-6 py-5">
              <div className="flex min-w-[320px] max-w-[420px] flex-1 items-center rounded-[4px] border border-[#c7cfe7] bg-white px-3 py-2.5">
                <FiSearch className="mr-2 text-[20px] text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  placeholder="Cari nama barang..."
                  className="w-full border-0 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

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
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-[#f0f3ff] text-[15px] text-slate-600">
                      <tr>
                        <th className="px-6 py-4 text-left font-medium">Foto</th>
                        <th className="px-6 py-4 text-left font-medium">Nama Barang</th>
                        <th className="px-6 py-4 text-left font-medium">Jumlah</th>
                        <th className="px-6 py-4 text-left font-medium">Kondisi</th>
                        <th className="px-6 py-4 text-left font-medium">Kategori</th>
                        <th className="px-6 py-4 text-right font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr key={item.id} className="border-t border-[#dfe4f2]">
                          <td className="px-6 py-4">
                            <div className="h-16 w-16 overflow-hidden rounded-[4px] border border-[#dfe4f2] bg-slate-100">
                              {item.gambar_inventaris ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.gambar_inventaris}
                                  alt={item.nama_inventaris ?? "Inventaris"}
                                  onError={fallbackImage}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[16px] font-medium text-slate-800">
                            {item.nama_inventaris ?? "-"}
                          </td>
                          <td className="px-6 py-4 text-[16px] text-slate-700">
                            {item.jumlah_inventaris ?? 0}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              tone={item.kondisi?.toLowerCase() === "rusak" ? "danger" : "success"}
                              className="normal-case tracking-normal"
                            >
                              {item.kondisi ?? "-"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-[16px] text-slate-700">
                            {item.nama_kategori ?? "-"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/inventaris/${item.id}/edit`}
                                className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-[#c7cfe7] bg-white px-4 text-[15px] font-medium text-[#155dfc]"
                              >
                                <FiEdit2 />
                                Edit
                              </Link>
                              <button
                                type="button"
                                disabled={deletingId === item.id}
                                onClick={() => handleDelete(item.id)}
                                className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-red-200 bg-white px-4 text-[15px] font-medium text-red-600 disabled:opacity-60"
                              >
                                <FiTrash2 />
                                {deletingId === item.id ? "Menghapus..." : "Hapus"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe4f2] px-6 py-4 text-[15px] text-slate-600">
                  <span>
                    Menampilkan {data.length} dari {meta.total ?? 0} inventaris
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
    </Suspense>
  );
}
