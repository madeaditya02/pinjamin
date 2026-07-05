"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiImage, FiSave } from "react-icons/fi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/api";

type Kategori = { id: number; nama_kategori?: string };

export default function TambahInventarisPage() {
  const router = useRouter();
  const [kategoriId, setKategoriId] = useState("");
  const [nama, setNama] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [kondisi, setKondisi] = useState("baik");
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [organisasiId, setOrganisasiId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => setLoading(true));

    Promise.all([api.get("/kategori"), api.get("/me")])
      .then(([kategoriResponse, meResponse]) => {
        if (!active) return;
        setKategoriList(kategoriResponse.data?.data ?? []);
        setOrganisasiId(meResponse.data?.data?.organisasi_id ?? meResponse.data?.organisasi_id ?? null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setGambar(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      if (organisasiId != null) formData.append("organisasi_id", String(organisasiId));
      formData.append("kategori_inventaris_id", kategoriId);
      formData.append("nama_inventaris", nama);
      if (gambar) formData.append("gambar_inventaris", gambar);
      formData.append("deskripsi_inventaris", deskripsi);
      formData.append("jumlah_inventaris", jumlah);
      formData.append("harga_inventaris", harga);
      formData.append("kondisi", kondisi);

      await api.post("/organisasi/inventaris", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/inventaris");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Tambah Barang">
      {loading ? (
        <div className="space-y-4">
          <div className="h-9 w-64 rounded bg-slate-100" />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-20 rounded bg-slate-100" />
            <div className="h-20 rounded bg-slate-100" />
          </div>
          <div className="h-[420px] rounded bg-slate-100" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-[31px] font-bold text-slate-800">Tambah Barang</h2>
            <p className="mt-1 text-[16px] text-slate-600">
              Lengkapi data inventaris baru di bawah ini.
            </p>
          </div>

          <Card className="grid gap-5 p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-slate-700">Kategori</span>
                <select
                  value={kategoriId}
                  onChange={(event) => setKategoriId(event.target.value)}
                  className="h-12 w-full rounded-[5px] border border-[#c9d0eb] bg-white px-4 outline-none"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {kategoriList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_kategori}
                    </option>
                  ))}
                </select>
              </label>

              <Input
                label="Nama Barang"
                value={nama}
                onChange={(event) => setNama(event.target.value)}
                placeholder="Kamera Canon"
                required
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-slate-700">
                  Gambar Barang
                </span>
                <div className="flex items-center gap-3 rounded-[5px] border border-[#c9d0eb] bg-white px-3 py-3">
                  <FiImage className="text-slate-500" />
                  <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm" />
                </div>
              </label>

              <Input
                label="Jumlah"
                type="number"
                value={jumlah}
                onChange={(event) => setJumlah(event.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                label="Harga"
                type="number"
                value={harga}
                onChange={(event) => setHarga(event.target.value)}
                placeholder="0"
                required
              />
              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-slate-700">Kondisi</span>
                <select
                  value={kondisi}
                  onChange={(event) => setKondisi(event.target.value)}
                  className="h-12 w-full rounded-[5px] border border-[#c9d0eb] bg-white px-4 outline-none"
                >
                  <option value="baik">Baik</option>
                  <option value="rusak">Rusak</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[15px] font-medium text-slate-700">
                Deskripsi Barang
              </span>
              <textarea
                value={deskripsi}
                onChange={(event) => setDeskripsi(event.target.value)}
                rows={5}
                className="w-full rounded-[5px] border border-[#c9d0eb] bg-white px-4 py-3 outline-none"
                required
              />
            </label>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="min-w-[220px]">
                <FiSave />
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </Card>
        </form>
      )}
    </DashboardLayout>
  );
}
