// app/carteira/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CarteiraPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["carteira"],
    queryFn: async () => {
      const res = await fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira");
      return res.json();
    },
  });

  if (isLoading) return <p>Carregando...</p>;

  const { carteira, resumos } = data;
  const { total_patrimonio, total_investido, tir_geral, proventos_totais } = resumos;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">📊 Minha Carteira</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Patrimônio</CardTitle></CardHeader>
          <CardContent>R$ {total_patrimonio.toLocaleString("pt-BR")}</CardContent></Card>
        <Card><CardHeader><CardTitle>Investido</CardTitle></CardHeader>
          <CardContent>R$ {total_investido.toLocaleString("pt-BR")}</CardContent></Card>
        <Card><CardHeader><CardTitle>TIR Geral</CardTitle></CardHeader>
          <CardContent>{tir_geral?.toFixed(2)}%</CardContent></Card>
        <Card><CardHeader><CardTitle>Proventos</CardTitle></CardHeader>
          <CardContent>R$ {proventos_totais.dividendos_total + proventos_totais.jcp_total}</CardContent></Card>
      </div>

      {/* Gráficos */}
      <Card>
        <CardHeader><CardTitle>Evolução Patrimonial</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resumos.proventos_temporais}>
              <XAxis dataKey="Data" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Total" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {["Ticker", "Qtde", "PM", "Atual", "Rentabilidade", "TIR"].map(h => (
                <th key={h} className="p-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carteira.map((a: any) => (
              <tr key={a.Ticker} className="border-t">
                <td className="p-2">{a.Ticker}</td>
                <td className="p-2">{a.quantidade}</td>
                <td className="p-2">R$ {a.preco_medio.toFixed(2)}</td>
                <td className="p-2">R$ {a.total_investido.toFixed(2)}</td>
                <td className="p-2">{a.Rentabilidade_preco_medio.toFixed(2)}%</td>
                <td className="p-2">{a.TIR.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
