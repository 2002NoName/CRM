import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

export default function ClientDetails() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await axios.get(`/clients/${clientId}`); //Get client details by ID
        setClient(res.data);
      } catch {
        setError('Błąd podczas pobierania szczegółów klienta'); //Handle error if client not found or other issues
      } finally {
        setLoading(false); //Set loading to false after fetching data
      }
    }
    fetchClient();
  }, [clientId]);

  if (loading) return <p className="text-center mt-4">Ładowanie...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;
  if (!client) return <p className="text-center mt-4">Klient nie znaleziony</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/clients')}
          className="text-blue-600 hover:underline"
        >
          ← Powrót do listy klientów
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          ← Powrót do dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold">{client.name}</h1>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Telefon:</strong> {client.phone}</p>
    </div>
  );
}
