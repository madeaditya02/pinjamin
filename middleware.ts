import { NextRequest, NextResponse } from "next/server";

const adminOnly = ["/users", "/kategori-inventaris"];
const orgOnly = ["/inventaris", "/peminjaman"];
const umumOrg = ["/pengajuan"];

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token) return redirectToLogin(request);

  const isAdminRoute = adminOnly.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isOrgRoute = orgOnly.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isUmumOrgRoute = umumOrg.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isAdminRoute && role !== "admin") return redirectHome(request);
  if (isOrgRoute && role !== "organisasi") return redirectHome(request);
  if (isUmumOrgRoute && !["umum", "organisasi"].includes(role ?? "")) return redirectHome(request);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
