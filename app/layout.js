import "./globals.css";
import Link from "next/link";
import { BarChart3, PiggyBank } from "lucide-react";

export const metadata = {
  title: "Consolidador de Investimentos",
  description: "Dashboard de Carteira e Lucros com FastAPI + Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-lg text-blue-600">💼 Meu Consolidado</h1>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/carteira" className="flex items-center gap-1 hover:text-blue-600 transition">
              <PiggyBank className="w-4 h-4" /> Carteira
            </Link>
            <Link href="/declaracao" className="flex items-center gap-1 hover:text-blue-600 transition">
              <BarChart3 className="w-4 h-4" /> Lucros
            </Link>
          </div>
        </nav>

        {/* Conteúdo principal */}
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
