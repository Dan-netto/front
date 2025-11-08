"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, PieChart, ArrowDownCircle, ArrowUpCircle } from "lucide-react"

export default function DashboardResumo() {
  const [data, setData] = useState<any[]>([])
  const [resumos, setResumos] = useState<any>(null)

  useEffect(() => {
    fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira")
      .then((res) => res.json())
      .then((json) => {
        setData(json.carteira)
        setResumos(json.resumos)
      })
      .catch((err) => console.error(err))
  }, [])

  const totals = useMemo(() => {
    const totalInvestido = data.reduce((sum, item) => sum + item.total_investido, 0)
    const totalDividendos = data.reduce((sum, item) => sum + item.dividendos, 0)
    const totalJCP = data.reduce((sum, item) => sum + item.juros_sobre_capital_proprio, 0)
    const tirMediaPonderada =
      totalInvestido > 0
        ? data.reduce((sum, item) => sum + item.TIR * item.total_investido, 0) / totalInvestido
        : 0
    return { totalInvestido, totalDividendos, totalJCP, tirMediaPonderada }
  }, [data])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      {/* Título */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">📊 Painel de Investimentos</h1>
        <p className="text-gray-500 mt-2">Acompanhe o desempenho e rentabilidade da sua carteira</p>
      </div>

      {/* Resumo Superior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
            <DollarSign className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-600">
              {formatCurrency(resumos?.investimento_total ?? totals.totalInvestido)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Rentabilidade Acumulada (%)</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {formatPercentage(resumos?.rentabilidade_total ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Total Resgatado</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(resumos?.total_resgatado ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Lucro / Prejuízo Total</CardTitle>
            <ArrowUpCircle className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                (resumos?.lucro_prejuizo_total ?? 0) >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(resumos?.lucro_prejuizo_total ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento da Carteira */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Carteira Detalhada</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((item) => (
            <Card key={item.Ticker} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{item.Ticker}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>Qtd:</strong> {item.quantidade}</p>
                <p><strong>Preço Médio:</strong> {formatCurrency(item.preco_medio)}</p>
                <p><strong>Investido:</strong> {formatCurrency(item.total_investido)}</p>
                <p><strong>Dividendos:</strong> {formatCurrency(item.dividendos)}</p>
                <p><strong>JCP:</strong> {formatCurrency(item.juros_sobre_capital_proprio)}</p>
                <p><strong>TIR:</strong> {formatPercentage(item.TIR)}</p>
                <p className={item.Rentabilidade_preco_medio > 0 ? "text-green-600" : "text-red-600"}>
                  <strong>Rent. PM:</strong> {formatPercentage(item.Rentabilidade_preco_medio)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
