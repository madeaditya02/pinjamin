"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiUpload, FiInfo, FiSend } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";

type Organisasi = { id: number; name?: string; nama?: string; email?: string; role?: string };
type Inventaris = {
  id: number;
  nama_inventaris?: string;
  gambar_inventaris?: string | null;
  kondisi?: string;
  nama_kategori?: string;
};

export default function TambahPengajuanPage() {
  const router = useRouter();
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [surat, setSurat] = useState<File | null>(null);
  const [organisasiId, setOrganisasiId] = useState("");
  const [organisasiList, setOrganisasiList] = useState<Organisasi[]>([]);
  const [inventarisList, setInventarisList] = useState<Inventaris[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [alasan, setAlasan] = useState("");
  const [loadingOrganisasi, setLoadingOrganisasi] = useState(true);
  const [loadingInventaris, setLoadingInventaris] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setLoadingOrganisasi(true));
    api
      .get("/organisasi")
      .then((response) => {
        setOrganisasiList(response.data?.data?.data ?? response.data?.data ?? []);
      })
      .catch(() => {
        setOrganisasiList([]);
      })
      .finally(() => setLoadingOrganisasi(false));
  }, []);

  useEffect(() => {
    if (!organisasiId || !tanggalMulai || !tanggalSelesai) return;

    Promise.resolve().then(() => setLoadingInventaris(true));
    api
      .get(`/organisasi/${organisasiId}/inventaris/available`, {
        params: { tanggal_mulai: tanggalMulai, tanggal_selesai: tanggalSelesai },
      })
      .then((response) => {
        setInventarisList(response.data?.data?.data ?? response.data?.data ?? []);
        setQuantities({});
      })
      .catch(() => {
        setInventarisList([]);
      })
      .finally(() => setLoadingInventaris(false));
  }, [organisasiId, tanggalMulai, tanggalSelesai]);

  const displayedInventaris =
    organisasiId && tanggalMulai && tanggalSelesai ? inventarisList : [];

  const selectedItems = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, qty]) => Number(qty) > 0)
        .map(([id, qty]) => ({ inventaris_id: Number(id), jumlah_dipinjam: Number(qty) })),
    [quantities]
  );

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setSurat(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("jenis", "peminjaman");
      formData.append("tanggal_mulai", tanggalMulai);
      formData.append("tanggal_selesai", tanggalSelesai);
      formData.append("waktu_mulai", waktuMulai);
      formData.append("waktu_selesai", waktuSelesai);
      formData.append("alasan", alasan);
      if (surat) formData.append("surat_pengajuan", surat);
      formData.append("items", JSON.stringify(selectedItems));

      await api.post("/pengajuan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/pengajuan");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan pada server";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Ajukan Peminjaman">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-[31px] font-bold text-slate-800">Ajukan Peminjaman</h2>
          <p className="mt-1 text-[16px] text-slate-600">
            Silakan lengkapi formulir di bawah ini untuk mengajukan peminjaman aset.
          </p>
        </div>

        {errorMessage ? <Alert message={errorMessage == 'items wajib diisi' ? "Pilih barang dan masukkan jumlahnya terlebih dahulu" : errorMessage} /> : null}

        <Card className="grid gap-5 p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-[16px] text-slate-700">Mulai Peminjaman</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(event) => setTanggalMulai(event.target.value)}
                  className="h-12 rounded-[4px] border border-[#8992b8] px-4 outline-none"
                />
                <input
                  type="time"
                  value={waktuMulai}
                  onChange={(event) => setWaktuMulai(event.target.value)}
                  className="h-12 rounded-[4px] border border-[#8992b8] px-4 outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-3 block text-[16px] text-slate-700">Selesai Peminjaman</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(event) => setTanggalSelesai(event.target.value)}
                  className="h-12 rounded-[4px] border border-[#8992b8] px-4 outline-none"
                />
                <input
                  type="time"
                  value={waktuSelesai}
                  onChange={(event) => setWaktuSelesai(event.target.value)}
                  className="h-12 rounded-[4px] border border-[#8992b8] px-4 outline-none"
                />
              </div>
            </label>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 text-[16px] text-slate-700">Surat Pengajuan</div>
            <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#c7cfe7] bg-[#fafbff] text-center">
              <FiUpload className="text-[28px] text-slate-500" />
              <div className="mt-4 text-[16px] text-slate-700">
                Klik atau seret file PDF ke sini
              </div>
              <div className="mt-1 text-[14px] text-slate-500">Maksimal ukuran file: 5MB</div>
              <input type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
              {surat ? (
                <div className="mt-4 text-sm text-[#155dfc]">{surat.name}</div>
              ) : null}
            </label>
          </Card>

          <Card className="p-6">
            <div className="mb-4 text-[16px] text-slate-700">Pilih Organisasi</div>
            {loadingOrganisasi ? (
              <div className="space-y-3">
                <div className="h-12 rounded-[4px] bg-slate-100" />
                <div className="h-5 w-72 rounded bg-slate-100" />
              </div>
            ) : (
              <>
                <div className="relative">
                  <select
                    value={organisasiId}
                    onChange={(event) => setOrganisasiId(event.target.value)}
                    className="h-12 w-full appearance-none rounded-[4px] border border-[#8992b8] px-4 pr-10 outline-none"
                  >
                    <option value="">Pilih salah satu...</option>
                    {organisasiList.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name ?? org.nama ?? org.email ?? `Organisasi ${org.id}`}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-500" />
                </div>
                <div className="mt-3 flex items-start gap-2 text-[14px] text-slate-500">
                  <FiInfo className="mt-0.5 shrink-0" />
                  <span>Aset yang tersedia akan bergantung pada organisasi yang dipilih.</span>
                </div>
              </>
            )}
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-[#d5dbef] px-6 py-5">
            <h3 className="text-[28px] font-semibold text-slate-800">Daftar Inventaris Tersedia</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-[#f0f3ff] text-[15px] text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Foto</th>
                  <th className="px-6 py-4 text-left font-medium">Nama</th>
                  <th className="px-6 py-4 text-left font-medium">Kondisi</th>
                  <th className="px-6 py-4 text-right font-medium">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {(loadingInventaris ? [] : displayedInventaris).map((item) => (
                  <tr key={item.id} className="border-t border-[#dfe4f2]">
                    <td className="px-6 py-4">
                      <div className="h-20 w-20 overflow-hidden rounded-[4px] border border-[#dfe4f2] bg-slate-100">
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
                    <td className="px-6 py-4">
                      <div className="text-[17px] font-semibold text-slate-800">
                        {item.nama_inventaris}
                      </div>
                      <div className="mt-1 text-[14px] text-slate-500">{item.nama_kategori}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        tone={item.kondisi?.toLowerCase() === "rusak" ? "danger" : "success"}
                        className="normal-case tracking-normal"
                      >
                        {item.kondisi}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input
                        type="number"
                        min={0}
                        value={quantities[item.id] ?? 0}
                        onChange={(event) =>
                          setQuantities((current) => ({
                            ...current,
                            [item.id]: Number(event.target.value),
                          }))
                        }
                        className="h-10 w-24 rounded-[4px] border border-[#8992b8] px-3 outline-none"
                      />
                    </td>
                  </tr>
                ))}
                {!loadingInventaris && !displayedInventaris.length ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      {organisasiId && tanggalMulai && waktuMulai && tanggalSelesai && waktuSelesai ? "Tidak ada inventaris tersedia." : "Pilih tanggal dan organisasi terlebih dahulu."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <label className="block">
            <span className="mb-3 block text-[16px] text-slate-700">Alasan Peminjaman</span>
            <textarea
              value={alasan}
              onChange={(event) => setAlasan(event.target.value)}
              rows={4}
              className="w-full rounded-[4px] border border-[#8992b8] p-4 outline-none"
            />
          </label>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[60px] items-center gap-3 rounded-[6px] bg-[#155dfc] px-8 text-[18px] font-semibold text-white shadow-[0_10px_24px_rgba(21,93,252,0.28)] disabled:opacity-60"
          >
            <FiSend />
            {submitting ? "Memproses..." : "Submit Pengajuan"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
