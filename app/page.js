"use client";
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({ combustivel: '', consumo: '' });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calcular = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://appcalculoemissao-2c6b30e79caa.herokuapp.com/emissao/estacionaria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          combustivel: form.combustivel,
          consumo: parseFloat(form.consumo),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error('Erro ao calcular emissão:', error);
      setResultado({ error: 'Erro ao calcular emissão. Verifique os dados.' });
    } finally {
      setLoading(false);
    }
  };

  return (

    
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Calculadora de Pegada de Carbono</h1>

        <div className="mb-4">
          <label htmlFor="combustivel" className="block font-medium">Combustivel:</label>
          <input
            id="combustivel"
            type="text"
            name="combustivel"
            value={form.combustivel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: Gasolina Automotiva Comercial"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="combustivel" className="block font-medium">Combustível:</label>
          <select
            id="combustivel"
            name="combustivel"
            value={form.combustivel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione um combustível</option>
            <option value="Gasolina Automotiva Comercial">Gasolina Automotiva Comercial</option>
            <option value="Óleo Diesel (comercial)">Óleo Diesel (comercial)</option>
            <option value="Etanol Anidro">Etanol Anidro</option>
            <option value="Biodiesel (B100)">Biodiesel (B100)</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="consumo" className="block font-medium">Consumo (litros):</label>
          <input
            id="consumo"
            type="number"
            name="consumo"
            value={form.consumo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: 100"
          />
        </div>

        <button
          onClick={calcular}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>

        {resultado?.error && (
          <p className="text-red-600 mt-4">{resultado.error}</p>
        )}

        {resultado && !resultado.error && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Resultado:</h2>
            <ul className="space-y-1">
              <li><strong>CO₂:</strong> {resultado.co2.toFixed(2)} kg</li>
              <li><strong>CH₄:</strong> {resultado.ch4.toFixed(4)} kg</li>
              <li><strong>N₂O:</strong> {resultado.n2o.toFixed(4)} kg</li>
              <li><strong>Total:</strong> {resultado.total.toFixed(3)} toneladas CO₂e</li>
            </ul>
          </div>
        )}
      </div>
    </div>
    

    
  );
}
