"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FiArrowLeft, FiCheckCircle, FiCalendar, FiFileText, FiXCircle } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

dayjs.locale("id");

type Item = {
  inventaris_id?: number;
  jumlah_dipinjam?: number;
  nama_inventaris?: string;
  gambar_inventaris?: string | null;
};

type Detail = {
  id: number;
  user_name?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  alasan?: string;
  surat_pengajuan?: string;
  status?: string;
  items?: Item[];
};

export default function PeminjamanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"approved" | "rejected" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    api
      .get(`/organisasi/pengajuan/${params.id}`)
      .then((response) => {
        if (!active) return;
        setData(response.data?.data ?? response.data ?? null);
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

  const handleStatus = async (status: "approved" | "rejected") => {
    setActionLoading(status);
    setErrorMessage(null);
    try {
      const loggedUser = JSON.parse(window.localStorage.getItem("pinjamin_user") ?? '{}');
      await api.put(`/organisasi/pengajuan/${params.id}/status`, {
        status,
        approver_id: loggedUser?.id ?? 2,
      });
      router.push("/peminjaman");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan pada server";
      setErrorMessage(message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout title="Halaman Detail Peminjaman">
      {loading ? (
        <div className="space-y-4">
          <div className="h-9 w-96 rounded bg-slate-100" />
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
            <h2 className="text-[31px] font-bold text-slate-800">Halaman Detail Peminjaman</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_1.55fr]">
            <Card className="p-6">
              <h3 className="text-[28px] font-bold text-[#155dfc]">Informasi Pengajuan</h3>
              <div className="my-4 border-t border-[#d8def0]" />
              <div className="space-y-5">
                <div>
                  <div className="text-[16px] text-slate-600">Nama Peminjam</div>
                  <div className="mt-1 text-[18px] font-semibold text-slate-800">
                    {data.user_name ?? "-"}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          {errorMessage ? <Alert message={errorMessage} /> : null}
          
          {data.status !== "returned" && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              disabled={!!actionLoading}
              onClick={() => handleStatus("rejected")}
              className="inline-flex h-14 min-w-[220px] items-center justify-center gap-2 rounded-[4px] border border-red-500 bg-white px-6 text-[17px] font-medium text-red-600"
            >
              <FiXCircle />
              {actionLoading === "rejected" ? "Memproses..." : "Reject"}
            </button>
            <button
              type="button"
              disabled={!!actionLoading}
              onClick={() => handleStatus("approved")}
              className="inline-flex h-14 min-w-[220px] items-center justify-center gap-2 rounded-[4px] bg-[#155dfc] px-6 text-[17px] font-medium text-white"
            >
              <FiCheckCircle />
              {actionLoading === "approved" ? "Memproses..." : "Approve"}
            </button>
          </div>
          )}
        </div>
      ) : null}
    </DashboardLayout>
  );
}
