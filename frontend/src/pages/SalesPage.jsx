import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);



  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/sales');
      setSales(res.data);
    } catch (err) {
      setError('Błąd podczas pobierania transakcji');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Ładowanie...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
      >
        ← Powrót do dashboardu
      </button>

      <h1 className="text-3xl font-bold mb-6">Lista transakcji</h1>

      <table className="min-w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Tytuł</th>
            <th className="border px-4 py-2 text-left">Klient</th>
            <th className="border px-4 py-2 text-left">Wartość</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Sprzedawca</th>
            <th className="border px-4 py-2 text-left">Data utworzenia</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{sale.title}</td>
              <td className="border px-4 py-2">
                {sale.client?.name || sale.client}
              </td>
              <td className="border px-4 py-2">{sale.value} PLN</td>
              <td className="border px-4 py-2">{sale.status}</td>
              <td className="border px-4 py-2">
                {sale.owner?.name || sale.owner?.email || '-'}
              </td>
              <td className="border px-4 py-2">
                {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}