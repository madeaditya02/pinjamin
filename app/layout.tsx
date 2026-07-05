import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pinjamin",
  description: "Pinjamin inventory management",
};

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`min-h-full flex flex-col bg-white text-slate-900 ${nunito.className}`}>
        {children}
      </body>
    </html>
  );
}
