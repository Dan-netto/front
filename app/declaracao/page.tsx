"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Declaracao() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/lucros")
      .then((res) => res.json())
      .then((res) => setData(res.lucros || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando lucros...</p>;
  if (!data.length) return <p>Nenhum lucro encontrado.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💰 Lucros e Vendas</h2>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Lucros por Data</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="Data do Negócio" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lucro" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b font-semibold text-gray-600">
                <th className="text-left py-2">Data</th>
                <th>Ticker</th>
                <th>Lucro</th>
                <th>Tipo</th>
                <th>Preço Médio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td>{row["Data do Negócio"]}</td>
                  <td>{row.Ticker}</td>
                  <td>R$ {row.lucro?.toFixed(2)}</td>
                  <td>{row["tipo venda"]}</td>
                  <td>R$ {row["Preço Médio Ajustado"]?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
