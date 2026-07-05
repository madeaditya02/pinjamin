"use client";

import { useEffect, useState, type FormEvent } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/services/api";

type User = { id: number; name?: string; email?: string; role?: string };
type PaginationMeta = { page?: number; limit?: number; total?: number };

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "umum", password: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users", { params: { page: 1, limit: 10 } });
      const payload = response.data?.data ?? response.data ?? {};
      setData(payload.data ?? []);
      setMeta(payload.pagination ?? {});
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
    setForm({ name: "", email: "", role: "umum", password: "" });
    setIsOpen(true);
  };

  const openEdit = (item: User) => {
    setSelected(item);
    setForm({ name: item.name ?? "", email: item.email ?? "", role: item.role ?? "umum", password: "" });
    setIsOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (selected) {
        const payload: Record<string, string> = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/admin/users/${selected.id}`, payload);
      } else {
        await api.post("/admin/users", form);
      }
      setIsOpen(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      await fetchData();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout title="Kelola User">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[31px] font-bold text-slate-800">Kelola User</h2>
            <p className="mt-1 text-[16px] text-slate-600">
              Tambah, ubah, dan hapus data user.
            </p>
          </div>
          <Button onClick={openAdd}>Tambah User</Button>
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
                  <th className="px-6 py-4 font-medium">Nama</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-[#dfe4f2]">
                    <td className="px-6 py-5 text-[16px] text-slate-800">{item.name}</td>
                    <td className="px-6 py-5 text-[16px] text-slate-700">{item.email}</td>
                    <td className="px-6 py-5">
                      <Badge
                        tone={
                          item.role === "admin"
                            ? "purple"
                            : item.role === "organisasi"
                              ? "info"
                              : "success"
                        }
                        className="normal-case tracking-normal"
                      >
                        {item.role}
                      </Badge>
                    </td>
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
          <div className="border-t border-[#dfe4f2] px-6 py-4 text-[15px] text-slate-600">
            Menampilkan {data.length} dari {meta.total ?? 0} user
          </div>
        </Card>
      </div>

      <Modal
        open={isOpen}
        title={selected ? "Edit User" : "Tambah User"}
        onClose={() => setIsOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="user-form" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        }
      >
        <form id="user-form" className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Nama"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <label className="block">
            <span className="mb-2 block text-[15px] font-medium text-slate-700">Role</span>
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              className="h-12 w-full rounded-[5px] border border-[#c9d0eb] bg-white px-4 outline-none"
            >
              <option value="umum">umum</option>
              <option value="organisasi">organisasi</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <Input
            label={selected ? "Password (opsional)" : "Password"}
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required={!selected}
          />
        </form>
      </Modal>
    </DashboardLayout>
  );
}
