"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiArrowRight, FiInbox, FiLock, FiMail } from "react-icons/fi";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      const token = response.data?.data?.token;

      if (token) {
        window.localStorage.setItem("token", token);
      }

      router.push("/");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login gagal";
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
            Login
          </h1>
          <p className="mt-2 text-[18px] leading-7 text-slate-600">
            Masuk untuk mulai menggunakan layanan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <Input
            label="Email"
            icon={<FiMail />}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@univ.ac.id"
            required
          />

          <Input
            label="Password"
            icon={<FiLock />}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />

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
            {loading ? "Memproses..." : "Login"}
            <FiArrowRight className="text-lg" />
          </Button>
        </form>

        <p className="mt-9 text-center text-[15px] text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-[#155dfc]">
            Daftar di sini
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
