import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, salesRes] = await Promise.all([
          axios.get('/clients'),
          axios.get('/sales'),
        ]);
        setClients(clientsRes.data);
        setSales(salesRes.data);
      } catch (err) {
        setError('Błąd podczas ładowania danych');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  //Group clients by creation date
  const groupedClients = clients.reduce((acc, client) => {
    const date = new Date(client.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupedClients)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, count]) => ({ date, count }));

  if (loading) return <p className="text-center mt-4">Ładowanie danych...</p>;
  if (error) return <p className="text-center text-red-600 mt-4">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/clients')}
          className="bg-blue-600 text-white rounded-lg p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Ilość klientów</h2>
          <p className="text-4xl font-bold">{clients.length}</p>
        </div>

        <div
          onClick={() => navigate('/sales')}
          className="bg-green-600 text-white rounded-lg p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Ilość sprzedaży</h2>
          <p className="text-4xl font-bold">{sales.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Nowi klienci w czasie</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
