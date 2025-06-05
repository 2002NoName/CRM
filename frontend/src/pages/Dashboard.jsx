import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, salesRes, usersRes] = await Promise.all([
          axios.get('/clients'),
          axios.get('/sales'),
          axios.get('/users'),
        ]);
        setClients(clientsRes.data);
        setSales(salesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError('Błąd podczas ładowania danych');
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Fetch role from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch {
        setUserRole('');
      }
    }
  }, []);

  // Group sales by month for chart
  const salesByMonth = sales.reduce((acc, sale) => {
    if (!sale.createdAt) return acc;
    const date = new Date(sale.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const salesChartData = Object.entries(salesByMonth)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([month, count]) => ({
      month,
      count,
    }));

  if (loading) return <p className="text-center mt-4">Ładowanie danych...</p>;
  if (error) return <p className="text-center text-red-600 mt-4">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Wyloguj się
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/clients')}
          className="bg-blue-600 text-white rounded-lg p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Klienci</h2>
          <p className="text-4xl font-bold">{clients.length}</p>
        </div>

        <div
          onClick={() => navigate('/sales')}
          className="bg-green-600 text-white rounded-lg p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Sprzedaż</h2>
          <p className="text-4xl font-bold">{sales.length}</p>
        </div>

        {(userRole === 'admin' || userRole === 'manager') && (
          <div
            onClick={() => navigate('/users')}
            className="bg-purple-600 text-white rounded-lg p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-purple-700 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Pracownicy</h2>
            <p className="text-4xl font-bold">
              <span className="text-4xl font-bold">{users.length}</span>
            </p>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Sprzedaż w poszczególnych miesiącach</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}