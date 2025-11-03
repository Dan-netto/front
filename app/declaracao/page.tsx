// app/declaracao/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

export default function DeclaracaoPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["lucros"],
    queryFn: async () => {
      const res = await fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/lucro");
      return res.json();
    },
  });

  if (isLoading) return <p>Carregando...</p>;

  const { lucros } = data;

  const exportCSV = () => {
    const csvContent = [
      ["Data", "Ticker", "Lucro", "Tipo Venda", "Preço Médio"],
      ...lucros.map((l: any) => [
        l["Data do Negócio"], l.Ticker, l.lucro, l["tipo venda"], l["Preço Médio Ajustado"]
      ]),
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "lucros.csv");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧾 Declaração de Lucros</h1>

      {/* Gráfico de lucros */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-2">Lucros por Data</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={lucros}>
            <XAxis dataKey="Data do Negócio" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="lucro" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              {["Data", "Ticker", "Lucro", "Tipo Venda", "PM Ajustado"].map(h => (
                <th key={h} className="p-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lucros.map((l: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="p-2">{l["Data do Negócio"]}</td>
                <td className="p-2">{l.Ticker}</td>
                <td className="p-2">R$ {l.lucro.toFixed(2)}</td>
                <td className="p-2">{l["tipo venda"]}</td>
                <td className="p-2">R$ {l["Preço Médio Ajustado"].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={exportCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
        Exportar CSV
      </Button>
    </div>
  );
}
