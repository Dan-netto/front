"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign } from "lucide-react"

export default function DashboardResumo() {
  const [data, setData] = useState<{ carteira: any[]; resumos: any } | null>(null)
  const [periodo, setPeriodo] = useState<"mes_atual" | "um_ano" | "dois_anos" | "desde_inicio">("desde_inicio")
  const proventosPeriodo = data?.resumos?.proventos?.[periodo] ?? 0



  useEffect(() => {
    fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira")
      .then((res) => res.json())
      .then((json) => setData(json))
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Investimentos</h1>
        <p className="text-muted-foreground">Consolidação e análise da sua carteira de ações</p>
      </div>

    <div className="flex gap-2 mb-4">
     <button onClick={() => setPeriodo("mes_atual")}>Mês Atual</button>
     <button onClick={() => setPeriodo("um_ano")}>1 Ano</button>
     <button onClick={() => setPeriodo("dois_anos")}>2 Anos</button>
     <button onClick={() => setPeriodo("desde_inicio")}>Desde Início</button>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Investido */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.totalInvestido)}</div>
          </CardContent>
        </Card>

        {/* Dividendos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dividendos Recebidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(proventosPeriodo)}
            </div>
          </CardContent>
        </Card>

        {/* JCP */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">JCP Recebidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totals.totalJCP)}</div>
          </CardContent>
        </Card>

        {/* TIR Média */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">TIR Média Ponderada</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatPercentage(totals.tirMediaPonderada)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
