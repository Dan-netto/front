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
            <table className="min-w-full table-auto border border-gray-300 mt-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-2 text-left min-w-[80px]">Ticker</th>
                  <th className="px-2 py-2 text-left min-w-[100px]">Preço Médio</th>
                  <th className="px-2 py-2 text-left min-w-[100px]">Quantidade</th>
                  <th className="px-2 py-2 text-left min-w-[120px]">Total Investido</th>
                  <th className="px-2 py-2 text-left min-w-[100px]">Dividendos</th>
                  <th className="px-2 py-2 text-left min-w-[160px]">Juros s/ Capital</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="px-2 py-1">{item.Ticker}</td>
                    <td className="px-2 py-1">R$ {item.preco_medio.toFixed(2)}</td>
                    <td className="px-2 py-1">{item.quantidade}</td>
                    <td className="px-2 py-1">R$ {item.total_investido.toFixed(2)}</td>
                    <td className="px-2 py-1">R$ {item.dividendos.toFixed(2)}</td>
                    <td className="px-2 py-1">R$ {item.juros_sobre_capital_proprio.toFixed(2)}</td>
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
