"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FiArrowLeft, FiCheckSquare, FiCalendar, FiFileText } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

dayjs.locale("id");

type Item = {
  inventaris_id?: number;
  jumlah_dipinjam?: number;
  nama_inventaris?: string;
  gambar_inventaris?: string | null;
  jumlah_dikembalikan?: number;
};

type Detail = {
  id: number;
  nama_peminjam?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  alasan?: string;
  surat_pengajuan?: string;
  status?: string;
  items?: Item[];
};

export default function ReturnPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    api
      .get(`/organisasi/pengajuan/${params.id}`)
      .then((response) => {
        if (!active) return;
        const payload = response.data?.data ?? response.data ?? null;
        setData(payload);
        const next: Record<number, number> = {};
        (payload?.items ?? []).forEach((item: Item) => {
          if (item.inventaris_id != null) next[item.inventaris_id] = item.jumlah_dipinjam ?? 0;
        });
        setQuantities(next);
      })
      .catch(() => {
        if (!active) return;
        setData(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  const handleSubmit = async () => {
    if (!data) return;
    setSubmitting(true);
    try {
      await api.post(`/organisasi/pengajuan/${params.id}/return`, {
        items: (data.items ?? [])
          .map((item) => ({
            inventaris_id: item.inventaris_id,
            jumlah_dikembalikan: quantities[item.inventaris_id ?? 0] ?? 0,
          }))
          .filter((item) => item.inventaris_id),
      });
      router.push("/peminjaman");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Kembalikan Inventaris">
      {loading ? (
        <div className="space-y-4">
          <div className="h-9 w-72 rounded bg-slate-100" />
          <div className="grid gap-5 lg:grid-cols-[1.05fr_1.55fr]">
            <div className="h-[480px] rounded border border-slate-200 bg-slate-100" />
            <div className="h-[480px] rounded border border-slate-200 bg-slate-100" />
          </div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/peminjaman" className="text-[28px] text-slate-700">
              <FiArrowLeft />
            </Link>
            <h2 className="text-[31px] font-bold text-slate-800">Kembalikan Inventaris</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_1.55fr]">
            <Card className="p-6">
              <h3 className="text-[28px] font-bold text-[#155dfc]">Informasi Pengajuan</h3>
              <div className="my-4 border-t border-[#d8def0]" />
              <div className="space-y-5">
                <div>
                  <div className="text-[16px] text-slate-600">Nama Peminjam</div>
                  <div className="mt-1 text-[18px] font-semibold text-slate-800">
                    {data.nama_peminjam ?? "-"}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-[16px] text-slate-600">Tanggal & Waktu Mulai</div>
                    <div className="mt-1 flex items-start gap-2 text-[18px] text-slate-800">
                      <FiCalendar className="mt-1 text-[#155dfc]" />
                      <span>
                        {data.tanggal_mulai ? dayjs(data.tanggal_mulai).format("D MMM YYYY") : "-"},{" "}
                        {data.waktu_mulai ?? "-"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[16px] text-slate-600">Tanggal & Waktu Selesai</div>
                    <div className="mt-1 flex items-start gap-2 text-[18px] text-slate-800">
                      <FiCalendar className="mt-1 text-red-500" />
                      <span>
                        {data.tanggal_selesai ? dayjs(data.tanggal_selesai).format("D MMM YYYY") : "-"},{" "}
                        {data.waktu_selesai ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[16px] text-slate-600">Alasan</div>
                  <div className="mt-1 text-[17px] leading-7 text-slate-800">{data.alasan ?? "-"}</div>
                </div>
                <div>
                  <div className="text-[16px] text-slate-600">Status</div>
                  <Badge tone={data.status === "approved" ? "success" : "warning"} className="mt-2">
                    {data.status ?? "-"}
                  </Badge>
                </div>
                <div>
                  <div className="text-[16px] text-slate-600">Dokumen Pendukung</div>
                  {data.surat_pengajuan ? (
                    <a
                      href={data.surat_pengajuan}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-[4px] bg-[#155dfc] px-4 py-3 text-[16px] font-medium text-white"
                    >
                      <FiFileText />
                      Surat Pengajuan.pdf
                    </a>
                  ) : (
                    <div className="mt-2 text-[16px] text-slate-500">-</div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b border-[#d8def0] px-6 py-6">
                <h3 className="text-[28px] font-bold text-[#155dfc]">Daftar Inventaris Dipinjam</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead className="bg-[#f0f3ff] text-[16px] text-slate-600">
                    <tr>
                      <th className="px-6 py-5 text-left font-medium">Foto</th>
                      <th className="px-6 py-5 text-left font-medium">Nama Inventaris</th>
                      <th className="px-6 py-5 text-left font-medium">Jumlah Dipinjam</th>
                      <th className="px-6 py-5 text-left font-medium">Jumlah Dikembalikan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.items ?? []).map((item, index) => (
                      <tr key={`${item.inventaris_id ?? "item"}-${index}`} className="border-t border-[#dfe4f2]">
                        <td className="px-6 py-5">
                          <div className="h-16 w-16 overflow-hidden rounded-[4px] border border-[#dfe4f2] bg-slate-100">
                            {item.gambar_inventaris ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.gambar_inventaris}
                                alt={item.nama_inventaris ?? "Inventaris"}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[18px] font-semibold text-slate-800">
                            {item.nama_inventaris ?? "-"}
                          </div>
                          <div className="mt-1 text-[14px] text-slate-500">
                            ID: {item.inventaris_id ?? "-"}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-[16px] font-semibold text-emerald-700">
                            {item.jumlah_dipinjam ?? 0} Unit
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <input
                            type="number"
                            min={0}
                            value={quantities[item.inventaris_id ?? 0] ?? 0}
                            onChange={(event) =>
                              setQuantities((current) => ({
                                ...current,
                                [item.inventaris_id ?? 0]: Number(event.target.value),
                              }))
                            }
                            className="h-10 w-24 rounded-[4px] border border-[#8992b8] px-3 outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex h-14 min-w-[260px] items-center justify-center gap-2 rounded-[4px] bg-[#155dfc] px-6 text-[17px] font-medium text-white"
            >
              <FiCheckSquare />
              {submitting ? "Memproses..." : "Kembalikan"}
            </button>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
