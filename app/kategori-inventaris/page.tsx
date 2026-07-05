"use client";

import { useEffect, useState, type FormEvent } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/services/api";

type Category = { id: number; nama_kategori?: string };

export default function KategoriInventarisPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/kategori");
      setData(response.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      void fetchData();
    });
  }, []);

  const openAdd = () => {
    setSelected(null);
    setName("");
    setIsOpen(true);
  };

  const openEdit = (item: Category) => {
    setSelected(item);
    setName(item.nama_kategori ?? "");
    setIsOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (selected) {
        await api.put(`/admin/kategori/${selected.id}`, { nama_kategori: name });
      } else {
        await api.post("/admin/kategori", { nama_kategori: name });
      }
      setIsOpen(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/kategori/${id}`);
      await fetchData();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout title="Kelola Kategori Inventaris">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[31px] font-bold text-slate-800">Kelola Kategori Inventaris</h2>
            <p className="mt-1 text-[16px] text-slate-600">
              Tambah, ubah, dan hapus kategori inventaris.
            </p>
          </div>
          <Button onClick={openAdd}>Tambah Kategori</Button>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-6">
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#f0f3ff] text-left text-[15px] text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama Kategori</th>
                  <th className="px-6 py-4 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-[#dfe4f2]">
                    <td className="px-6 py-5 text-[16px] text-slate-800">{item.nama_kategori}</td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => openEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="border border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => void handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? "Menghapus..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Modal
        open={isOpen}
        title={selected ? "Edit Kategori" : "Tambah Kategori"}
        onClose={() => setIsOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="kategori-form" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        }
      >
        <form id="kategori-form" onSubmit={handleSubmit}>
          <Input
            label="Nama Kategori"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </form>
      </Modal>
    </DashboardLayout>
  );
}
