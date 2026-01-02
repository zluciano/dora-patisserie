import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Dora Patisserie - Gerenciamento de Pedidos",
  description: "Sistema de gerenciamento de pedidos para Dora Patisserie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
