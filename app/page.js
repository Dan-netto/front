"use client";
import { useState } from "react";

export default function Carteira() {
  const [ticker, setTicker] = useState("");
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultar = async () => {
    setLoading(true);
    setErro(null);
    setDados(null);
    try {
      const res = await fetch(`https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira/${ticker}`);
      if (!res.ok) throw new Error("Erro na consulta");
      const json = await res.json();
      setDados(json);
    } catch (err) {
      setErro("Ticker não encontrado ou erro na API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📊 Consultar Carteira</h1>

        <div className="mb-4">
          <label className="block font-medium">Ticker:</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Ex: ITSA4"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={consultar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>

        {erro && <p className="text-red-600 mt-4">{erro}</p>}

        {dados && (
          <div className="mt-6 space-y-2">
            <p><strong>Ticker:</strong> {dados.ticker}</p>
            <p><strong>Preço Médio:</strong> R$ {dados.preco_medio.toFixed(2)}</p>
            <p><strong>Quantidade:</strong> {dados.quantidade}</p>
            <p><strong>Total Investido:</strong> R$ {dados.total_investido.toFixed(2)}</p>
            <p><strong>Dividendos:</strong> R$ {dados.dividendos.toFixed(2)}</p>
            <p><strong>Juros Sobre Capital Próprio:</strong> R$ {dados.juros_sobre_capital_proprio.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

