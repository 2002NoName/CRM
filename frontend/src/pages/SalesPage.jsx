import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await axios.get('/sales');
        setSales(res.data);
      } catch (err) {
        setError('Błąd podczas pobierania sprzedaży');
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  if (loading) return <p className="text-center mt-4">Ładowanie sprzedaży...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Powrót do dashboardu
      </button>
      <h1 className="text-3xl font-bold mb-6">Lista sprzedaży</h1>
      <table className="min-w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Klient</th>
            <th className="border px-4 py-2 text-left">Data</th>
            <th className="border px-4 py-2 text-left">Kwota</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale._id} className="hover:bg-gray-50 cursor-pointer">
              <td className="border px-4 py-2">{sale.productName}</td>
              <td className="border px-4 py-2">{sale.clientName}</td>
              <td className="border px-4 py-2">{new Date(sale.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{sale.amount} PLN</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
