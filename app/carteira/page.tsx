"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function CarteiraPage() {
  const [data, setData] = useState<any[]>([]);
  const [resumos, setResumos] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira")
      .then((res) => res.json())
      .then((json) => {
        if (json?.carteira && Array.isArray(json.carteira)) {
          setData(json.carteira);
        } else {
          console.warn("⚠️ Resposta inesperada da API:", json);
          setData([]);
        }
        setResumos(json?.resumos ?? {});
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setData([]);
        setResumos({});
        setIsLoading(false);
      });
  }, []);

  const totals = useMemo(() => {
    if (!Array.isArray(data)) return {};

    const totalInvestidoAtivo = data.reduce((sum, item) => sum + (item.total_investido || 0), 0);
    const totalDividendos = data.reduce((sum, item) => sum + (item.dividendos || 0), 0);
    const totalJCP = data.reduce((sum, item) => sum + (item.juros_sobre_capital_proprio || 0), 0);
    const tirGeral =
      totalInvestidoAtivo > 0
        ? data.reduce((sum, item) => sum + (item.TIR * item.total_investido || 0), 0) /
          totalInvestidoAtivo
        : 0;

    return {
      totalInvestidoAtivo,
      totalDividendos,
      totalJCP,
      tirGeral,
    };
  }, [data]);

  if (isLoading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="space-y-8">
      {/* --- Indicadores principais --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="bg-indigo-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">💰 Patrimônio Total</p>
            <p className="text-xl font-bold text-indigo-700">
              R$ {resumos?.Patrimonio_total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">🏦 Total Investido (Carteira Atual)</p>
            <p className="text-xl font-bold text-green-700">
              R$ {totals.totalInvestidoAtivo?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">💸 Investimento Total (Histórico)</p>
            <p className="text-xl font-bold text-yellow-700">
              R$ {resumos?.investimento_total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">📈 Rentabilidade Acumulada</p>
            <p className="text-xl font-bold text-purple-700">
              {resumos?.Rentabilidade_total?.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">💰 Total Resgatado</p>
            <p className="text-xl font-bold text-pink-700">
              R$ {resumos?.total_resgatado?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">📊 Lucro / Prejuízo Total</p>
            <p className="text-xl font-bold text-red-700">
              R$ {resumos?.lucro_prejuizo_total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-teal-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">🧾 Proventos Totais</p>
            <p className="text-xl font-bold text-teal-700">
              R$ {resumos?.proventos?.desde_inicio?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">⚙️ TIR Geral</p>
            <p className="text-xl font-bold text-blue-700">{totals.tirGeral.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Tabela de ativos --- */}
      <Card className="shadow-md">
        <CardContent className="overflow-x-auto p-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 text-left">Ticker</th>
                <th className="p-2 text-right">Preço Médio</th>
                <th className="p-2 text-right">Preço Última Atualização</th>
                <th className="p-2 text-right">Quantidade</th>
                <th className="p-2 text-right">Total Investido</th>
                <th className="p-2 text-right">TIR</th>
                <th className="p-2 text-right">Rentabilidade</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Ticker} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">{item.Ticker}</td>
                  <td className="p-2 text-right">
                    R$ {item.preco_medio?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-2 text-right">
                    R$ {item.ultimo_atualizacao_preco?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-2 text-right">{item.quantidade}</td>
                  <td className="p-2 text-right">
                    R$ {item.total_investido?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-2 text-right">{item.TIR?.toFixed(2)}%</td>
                  <td className="p-2 text-right">{item.Rentabilidade_preco_medio?.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* --- Gráfico opcional de distribuição --- */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Distribuição por Ticker</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="Ticker" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
              <Bar dataKey="total_investido" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
