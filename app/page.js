"use client";
import { useEffect, useState } from "react";

export default function Carteira() {
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await fetch("https://appcalculoemissao-2c6b30e79caa.herokuapp.com/carteira");
        if (!res.ok) throw new Error("Erro ao buscar dados da API");
        const json = await res.json();
        setDados(json);
      } catch (err) {
        setErro("Erro ao carregar dados da API");
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📊 Carteira Completa</h1>

        {loading && <p>Carregando...</p>}
        {erro && <p className="text-red-600">{erro}</p>}

        {!loading && dados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">Ticker</th>
                  <th className="border px-4 py-2 text-left">Preço Médio</th>
                  <th className="border px-4 py-2 text-left">Quantidade</th>
                  <th className="border px-4 py-2 text-left">Total Investido</th>
                  <th className="border px-4 py-2 text-left">Dividendos</th>
                  <th className="border px-4 py-2 text-left">Juros Sobre Capital Próprio</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{item.ticker}</td>
                    <td className="border px-4 py-2">R$ {item.preco_medio.toFixed(2)}</td>
                    <td className="border px-4 py-2">{item.quantidade}</td>
                    <td className="border px-4 py-2">R$ {item.total_investido.toFixed(2)}</td>
                    <td className="border px-4 py-2">R$ {item.dividendos.toFixed(2)}</td>
                    <td className="border px-4 py-2">R$ {item.juros_sobre_capital_proprio.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
