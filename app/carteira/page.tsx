"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";

export default function Carteira() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando dados da carteira...</p>;
  if (!data) return <p>Erro ao carregar dados.</p>;

  const carteira = data.carteira || [];
  const resumos = data.resumos || {};
  const proventos = resumos.proventos_temporais || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Consolidação da Carteira</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent><p className="text-sm text-gray-500">Patrimônio Total</p><p className="text-xl font-bold">R$ {resumos.total_patrimonio?.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-gray-500">Investido</p><p className="text-xl font-bold">R$ {resumos.total_investido?.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-gray-500">TIR Média</p><p className="text-xl font-bold">{resumos.tir_geral?.toFixed(2)}%</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-gray-500">Proventos Totais</p><p className="text-xl font-bold">R$ {resumos.proventos_totais?.dividendos_total + resumos.proventos_totais?.jcp_total}</p></CardContent></Card>
      </div>

      {/* Gráfico de Proventos */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Evolução dos Proventos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={proventos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="AnoMes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Dividendo" fill="#4CAF50" />
              <Bar dataKey="Juros Sobre Capital Próprio" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Carteira */}
      <Card>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b font-semibold text-gray-600">
                <th className="text-left py-2">Ticker</th>
                <th>Preço Médio</th>
                <th>Quantidade</th>
                <th>Investido</th>
                <th>TIR</th>
                <th>Rentabilidade</th>
              </tr>
            </thead>
            <tbody>
              {carteira.map((item: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td>{item.Ticker}</td>
                  <td>R$ {item.preco_medio?.toFixed(2)}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.total_investido?.toFixed(2)}</td>
                  <td>{item.TIR?.toFixed(2)}%</td>
                  <td className={item.Rentabilidade_preco_medio > 0 ? "text-green-600" : "text-red-500"}>
                    {item.Rentabilidade_preco_medio?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
