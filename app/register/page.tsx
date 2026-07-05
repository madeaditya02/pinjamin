"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiArrowRight, FiInbox, FiLock, FiMail, FiUser } from "react-icons/fi";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    if (!agree) {
      setError("Setujui syarat dan ketentuan terlebih dahulu");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/register", { name, email, password });
      router.push("/login");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registrasi gagal";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-[490px] px-10 py-12">
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[41px] font-extrabold leading-none text-[#155dfc]">
            <FiInbox className="text-[34px]" />
            <span>Pinjamin</span>
          </div>
          <h1 className="mt-8 text-[32px] font-extrabold leading-tight text-slate-800">
            Buat Akun Baru
          </h1>
          <p className="mt-2 text-[18px] leading-7 text-slate-600">
            Daftar untuk mulai meminjam dan mengelola inventaris
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Input
            label="Nama Lengkap"
            icon={<FiUser />}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            icon={<FiMail />}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@univ.ac.id"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              icon={<FiLock />}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              label="Konfirmasi Password"
              icon={<FiLock />}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <label className="flex items-start gap-3 text-[14px] leading-5 text-slate-700">
            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => setAgree(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#c9d0eb] text-[#155dfc] focus:ring-[#155dfc]"
            />
            <span>
              Saya setuju dengan{" "}
              <span className="font-semibold text-[#155dfc]">Syarat & Ketentuan</span>{" "}
              serta{" "}
              <span className="font-semibold text-[#155dfc]">Kebijakan Privasi</span>{" "}
              Pinjamin.
            </span>
          </label>

          {error ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full py-3.5 text-[15px]"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar"}
            <FiArrowRight className="text-lg" />
          </Button>
        </form>

        <p className="mt-9 text-center text-[15px] text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-[#155dfc]">
            Masuk di sini
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
