import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingClientId, setEditingClientId] = useState(null);
  const navigate = useNavigate();

  // Fetch clients
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('/clients');
      setClients(res.data);
    } catch (err) {
      setError('Błąd podczas pobierania klientów');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingClientId) {
        await axios.put(`/clients/${editingClientId}`, form);
      } else {
        await axios.post('/clients', form);
      }
      setForm({ name: '', email: '', phone: '' });
      setEditingClientId(null);
      fetchClients();
    } catch (err) {
      setError('Błąd zapisu klienta');
    }
  };

  const handleEdit = client => {
    setForm({ name: client.name, email: client.email, phone: client.phone });
    setEditingClientId(client._id);
  };

  const handleDelete = async clientId => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego klienta?')) return;
    try {
      await axios.delete(`/clients/${clientId}`);
      fetchClients();
    } catch (err) {
      setError('Błąd usuwania klienta');
    }
  };

  if (loading) return <p className="text-center mt-4">Ładowanie...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Przycisk powrotu do dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
      >
        ← Powrót do dashboardu
      </button>

      <h1 className="text-3xl font-bold mb-6">Lista klientów</h1>

      {/* Formularz dodawania/edycji */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nazwa"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-full md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingClientId ? 'Zapisz zmiany' : 'Dodaj klienta'}
        </button>
      </form>

      {/* Tabela klientów */}
      <table className="min-w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Nazwa</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Telefon</th>
            <th className="border px-4 py-2 text-left">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr
              key={client._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/clients/${client._id}`)}
            >
              <td className="border px-4 py-2">{client.name}</td>
              <td className="border px-4 py-2">{client.email}</td>
              <td className="border px-4 py-2">{client.phone}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEdit(client);
                  }}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edytuj
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(client._id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
