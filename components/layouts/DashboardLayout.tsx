"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { FiGrid, FiInbox, FiLogOut } from "react-icons/fi";
import { api } from "@/services/api";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

type UserProfile = {
  name?: string;
  role?: string;
  email?: string;
  profile_photo?: string | null;
};

const navItems = [
  { href: "/", label: "Dashboard", icon: FiGrid },
  { href: "/pengajuan", label: "Peminjaman", icon: FiInbox },
];

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoadingUser(true);
    });

    api
      .get("/me")
      .then((response) => {
        if (!active) return;
        setUser(response.data?.data ?? response.data ?? null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      })
      .finally(() => {
        if (!active) return;
        setLoadingUser(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore logout errors and clear local session anyway
    }

    window.localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#d9def0] bg-[#f5f7ff] lg:flex lg:flex-col">
          <div className="flex h-[136px] items-center gap-3 border-b border-[#d9def0] px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#155dfc] text-white">
              <FiInbox className="text-[22px]" />
            </div>
            <div>
              <div className="text-[28px] font-extrabold leading-none text-[#155dfc]">
                Pinjamin
              </div>
              <div className="mt-1 text-[13px] font-medium text-slate-500">
                Inventory Management
              </div>
            </div>
          </div>

          <nav className="flex-1 pt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-[48px] items-center gap-3 px-5 text-[16px] transition ${
                    active ? "bg-[#155dfc] text-white" : "text-slate-700 hover:bg-white"
                  }`}
                >
                  <Icon className="text-[22px]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex h-[62px] items-center justify-between border-b border-[#d9def0] bg-[#f5f7ff] px-4 md:px-8">
            <h1 className="text-[29px] font-bold tracking-tight text-slate-800">
              {title}
            </h1>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex items-center gap-3 text-left"
                disabled={loadingUser}
              >
                <div className="text-right">
                  {loadingUser ? (
                    <>
                      <div className="ml-auto h-4 w-28 rounded bg-slate-200" />
                      <div className="ml-auto mt-2 h-3 w-20 rounded bg-slate-200" />
                    </>
                  ) : (
                    <>
                      <div className="text-[14px] font-medium text-slate-900">
                        {user?.name ?? "User"}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {user?.role ?? "UMUM"}
                      </div>
                    </>
                  )}
                </div>
                <div className="h-9 w-9 overflow-hidden rounded-full border border-[#d9def0] bg-white">
                  {loadingUser ? (
                    <div className="h-full w-full animate-pulse bg-slate-200" />
                  ) : user?.profile_photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profile_photo}
                      alt={user?.name ?? "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs font-semibold text-slate-600">
                      {user?.name?.slice(0, 2).toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-md border border-[#d9def0] bg-white p-3 shadow-lg">
                  <div className="px-2 py-1">
                    {loadingUser ? (
                      <>
                        <div className="h-4 w-32 rounded bg-slate-200" />
                        <div className="mt-2 h-3 w-40 rounded bg-slate-200" />
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-slate-800">
                          {user?.name ?? "User"}
                        </div>
                        <div className="text-xs text-slate-500">{user?.email ?? ""}</div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </header>

          <main className="px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
