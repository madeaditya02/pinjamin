"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FiArrowRightCircle, FiCheckCircle, FiClock, FiRefreshCcw } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/services/api";

dayjs.locale("id");

type DashboardDataUmum = {
  aktif?: number;
  pending?: number;
  approved?: number;
  diapproved?: number;
};
type DashboardDataOrg = {
  permintaan_masuk?: number;
  barang_dipinjam?: number;
  total_barang?: number;
};
type RecentItem = {
  id?: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status?: string;
  alasan?: string;
};

function DashboardUmum({ loading }: { loading: boolean }) {
  const [data, setData] = useState<DashboardDataUmum | null>(null);
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    let active = true;
    if (loading) return;

    Promise.all([api.get("/umum/dashboard"), api.get("/pengajuan/me?limit=3")])
      .then(([dashboardResponse, pengajuanResponse]) => {
        if (!active) return;
        setData(dashboardResponse.data?.data ?? dashboardResponse.data ?? null);
        setRecent(pengajuanResponse.data?.data?.data ?? pengajuanResponse.data?.data ?? []);
      })
      .catch(() => {
        if (!active) return;
        setData(null);
        setRecent([]);
      });

    return () => {
      active = false;
    };
  }, [loading]);

  if (loading || !data) {
    return (
      <div className="space-y-7">
        <div className="h-[182px] rounded-[9px] bg-slate-100" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-[146px] rounded-[4px] bg-slate-100" />
          <div className="h-[146px] rounded-[4px] bg-slate-100" />
          <div className="h-[146px] rounded-[4px] bg-slate-100" />
        </div>
        <div className="h-[304px] rounded-[4px] bg-slate-100" />
        <div className="flex gap-4">
          <div className="h-[54px] w-[210px] rounded-[6px] bg-slate-100" />
          <div className="h-[54px] w-[180px] rounded-[6px] bg-slate-100" />
        </div>
      </div>
    );
  }

  const total = data.aktif ?? 0;
  const pending = data.pending ?? 0;
  const approved = data.approved ?? data.diapproved ?? 0;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[9px] bg-[#155dfc] px-6 py-6 text-white shadow-[0_10px_30px_rgba(21,93,252,0.18)] md:px-7 md:py-7">
        <div className="max-w-3xl">
          <h2 className="text-[34px] font-medium leading-tight">
            Halo, Selamat Datang di Pinjamin
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-7 text-white/85">
            Kelola permohonan peminjaman sarana dan prasarana fakultas dengan mudah dalam satu
            platform terintegrasi.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-[120px] bg-white/5" />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="px-5 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[17px] text-slate-600">Total Peminjaman</div>
              <div className="mt-3 text-[46px] font-bold leading-none text-slate-800">
                {String(total).padStart(2, "0")}
              </div>
            </div>
            <FiRefreshCcw className="mt-1 text-[28px] text-[#155dfc]" />
          </div>
        </Card>
        <Card className="px-5 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[17px] text-slate-600">Peminjaman Pending</div>
              <div className="mt-3 text-[46px] font-bold leading-none text-slate-800">
                {String(pending).padStart(2, "0")}
              </div>
              <div className="mt-3 text-[15px] text-slate-500">Menunggu persetujuan admin</div>
            </div>
            <FiClock className="mt-1 text-[28px] text-violet-600" />
          </div>
        </Card>
        <Card className="px-5 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[17px] text-slate-600">Peminjaman Di-approved</div>
              <div className="mt-3 text-[46px] font-bold leading-none text-slate-800">
                {String(approved).padStart(2, "0")}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[15px] font-medium text-emerald-700">
                <FiCheckCircle className="text-[16px]" />
                Siap untuk pengambilan
              </div>
            </div>
            <FiCheckCircle className="mt-1 text-[28px] text-emerald-600" />
          </div>
        </Card>
      </section>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#cfd6ec] px-6 py-5">
          <h3 className="text-[28px] font-semibold text-slate-800">Peminjaman Terakhir</h3>
          <Link href="/pengajuan" className="text-[16px] font-medium text-[#155dfc]">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-[#f0f3ff] text-[13px] uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Tanggal Pinjam</th>
                <th className="px-6 py-4 font-medium">Tanggal Selesai</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Alasan</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(recent.length ? recent : [null, null, null]).map((item, index) => (
                <tr key={item?.id ?? index} className="border-t border-[#e2e7f5]">
                  <td className="px-6 py-5 text-[16px] text-slate-700">
                    {item?.tanggal_mulai ? dayjs(item.tanggal_mulai).format("D MMM YYYY") : "-"}
                  </td>
                  <td className="px-6 py-5 text-[16px] text-slate-700">
                    {item?.tanggal_selesai ? dayjs(item.tanggal_selesai).format("D MMM YYYY") : "-"}
                  </td>
                  <td className="px-6 py-5">
                    <Badge
                      tone={
                        item?.status === "approved"
                          ? "success"
                          : item?.status === "pending"
                            ? "purple"
                            : item?.status === "rejected"
                              ? "danger"
                              : "info"
                      }
                      className="normal-case tracking-normal"
                    >
                      {item?.status ?? "-"}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-[16px] text-slate-700">
                    {item?.alasan ?? "-"}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button type="button" className="font-medium text-[#155dfc]">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/pengajuan/tambah"
          className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-[6px] bg-[#155dfc] px-6 text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(21,93,252,0.28)]"
        >
          <FiArrowRightCircle className="text-[22px]" />
          Ajukan Peminjaman
        </Link>
        <Link
          href="/pengajuan"
          className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-[6px] border border-[#c8d0eb] bg-white px-6 text-[17px] font-medium text-slate-800"
        >
          <FiClock className="text-[22px]" />
          Riwayat Saya
        </Link>
      </div>
    </div>
  );
}

function DashboardOrganisasi({ loading }: { loading: boolean }) {
  const [data, setData] = useState<DashboardDataOrg | null>(null);

  useEffect(() => {
    let active = true;
    if (loading) return;

    api
      .get("/organisasi/dashboard")
      .then((response) => {
        if (!active) return;
        setData(response.data?.data ?? response.data ?? null);
      })
      .catch(() => {
        if (!active) return;
        setData(null);
      });

    return () => {
      active = false;
    };
  }, [loading]);

  if (loading || !data) {
    return (
      <div className="space-y-7">
        <div className="h-[182px] rounded-[9px] bg-slate-100" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-[146px] rounded-[4px] bg-slate-100" />
          <div className="h-[146px] rounded-[4px] bg-slate-100" />
          <div className="h-[146px] rounded-[4px] bg-slate-100" />
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Permintaan Masuk",
      value: data.permintaan_masuk ?? 0,
      icon: "📋",
      note: "+3 dari kemarin",
    },
    {
      label: "Barang Dipinjam",
      value: data.barang_dipinjam ?? 0,
      icon: "↔",
      note: "Sedang berjalan",
    },
    {
      label: "Total Barang",
      value: data.total_barang ?? 0,
      icon: "▣",
      note: "Semua aset tercatat",
    },
  ];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[9px] bg-[#155dfc] px-6 py-6 text-white shadow-[0_10px_30px_rgba(21,93,252,0.18)] md:px-7 md:py-7">
        <div className="max-w-3xl">
          <h2 className="text-[34px] font-medium leading-tight">
            Halo, Selamat Datang di Pinjamin
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-7 text-white/85">
            Kelola permohonan peminjaman sarana dan prasarana fakultas dengan mudah dalam satu
            platform terintegrasi.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-[120px] bg-white/5" />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={index} className="px-5 py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-lg">
                  {card.icon}
                </div>
                <div className="text-[17px] text-slate-600">{card.label}</div>
                <div className="mt-3 text-[46px] font-bold leading-none text-slate-800">
                  {String(card.value).padStart(2, "0")}
                </div>
                <div className="mt-3 text-[15px] text-emerald-700">{card.note}</div>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default function HomePage() {
  const [role, setRole] = useState<string>("umum");
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoadingRole(true);
    });

    api
      .get("/me")
      .then((response) => {
        if (!active) return;
        setRole(response.data?.data?.role ?? response.data?.role ?? "umum");
      })
      .catch(() => {
        if (!active) return;
        setRole("umum");
      })
      .finally(() => {
        if (!active) return;
        setLoadingRole(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      {role === "organisasi" ? <DashboardOrganisasi loading={loadingRole} /> : <DashboardUmum loading={loadingRole} />}
    </DashboardLayout>
  );
}
