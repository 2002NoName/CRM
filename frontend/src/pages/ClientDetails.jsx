import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');

  // Forms
  const [noteContent, setNoteContent] = useState('');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDueDate, setReminderDueDate] = useState('');
  const [saleForm, setSaleForm] = useState({ title: '', value: '', status: 'lead' });
  const [editingSaleId, setEditingSaleId] = useState(null);

  useEffect(() => {
    getRoleFromToken();
    fetchAll();
  }, [clientId]);

  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch {
        setUserRole('');
      }
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientRes = await axios.get(`/clients/${clientId}`);
      setClient(clientRes.data);

      const notesRes = await axios.get('/notes');
      setNotes(notesRes.data.filter(note => note.relatedTo?.kind === 'Client' && note.relatedTo?.item === clientId));

      const remindersRes = await axios.get('/reminders');
      setReminders(remindersRes.data.filter(rem => rem.relatedTo?.kind === 'Client' && rem.relatedTo?.item === clientId));

      const salesRes = await axios.get('/sales');
      setSales(salesRes.data.filter(sale => sale.client === clientId || sale.client?._id === clientId));
    } catch (err) {
      setError('Błąd podczas pobierania danych klienta');
    } finally {
      setLoading(false);
    }
  };

  // --- NOTES ---
  const handleNoteSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/notes', {
        content: noteContent,
        relatedTo: { kind: 'Client', item: clientId }
      });
      setNoteContent('');
      fetchAll();
    } catch {
      setError('Błąd zapisu notatki');
    }
  };

  const handleNoteDelete = async noteId => {
    if (!window.confirm('Usunąć notatkę?')) return;
    try {
      await axios.delete(`/notes/${noteId}`);
      fetchAll();
    } catch {
      setError('Błąd usuwania notatki');
    }
  };

  // --- REMINDERS ---
  const handleReminderSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/reminders', {
        title: reminderTitle,
        dueDate: reminderDueDate,
        relatedTo: { kind: 'Client', item: clientId }
      });
      setReminderTitle('');
      setReminderDueDate('');
      fetchAll();
    } catch {
      setError('Błąd zapisu przypomnienia');
    }
  };

  const handleReminderDelete = async reminderId => {
    if (!window.confirm('Usunąć przypomnienie?')) return;
    try {
      await axios.delete(`/reminders/${reminderId}`);
      fetchAll();
    } catch {
      setError('Błąd usuwania przypomnienia');
    }
  };

  const handleReminderDone = async reminderId => {
    try {
      await axios.patch(`/reminders/${reminderId}`, { isDone: true });
      fetchAll();
    } catch {
      setError('Błąd oznaczania przypomnienia jako wykonane');
    }
  };

  // --- SALES ---
  const handleSaleChange = e => {
    setSaleForm({ ...saleForm, [e.target.name]: e.target.value });
  };

  const handleSaleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingSaleId) {
        await axios.put(`/sales/${editingSaleId}`, {
          ...saleForm,
          client: clientId
        });
      } else {
        await axios.post('/sales', {
          ...saleForm,
          client: clientId
        });
      }
      setSaleForm({ title: '', value: '', status: 'lead' });
      setEditingSaleId(null);
      fetchAll();
    } catch {
      setError('Błąd zapisu transakcji');
    }
  };

  const handleSaleEdit = sale => {
    setSaleForm({
      title: sale.title || '',
      value: sale.value || '',
      status: sale.status || 'lead'
    });
    setEditingSaleId(sale._id);
  };

  const handleSaleDelete = async saleId => {
    if (!window.confirm('Usunąć transakcję?')) return;
    try {
      await axios.delete(`/sales/${saleId}`);
      fetchAll();
    } catch {
      setError('Błąd usuwania transakcji');
    }
  };

  if (loading) return <p className="text-center mt-4">Ładowanie...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;
  if (!client) return <p className="text-center mt-4 text-red-600">Nie znaleziono klienta</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/clients')}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
      >
        ← Powrót do listy klientów
      </button>

      <h1 className="text-3xl font-bold mb-4">{client.name}</h1>
      <div className="mb-6 space-y-1">
        <div><span className="font-semibold">Osoba kontaktowa:</span> {client.contactName || '-'}</div>
        <div><span className="font-semibold">Email:</span> {client.email || '-'}</div>
        <div><span className="font-semibold">Telefon:</span> {client.phone || '-'}</div>
        <div><span className="font-semibold">Status:</span> {client.status}</div>
      </div>

      {/* Notes and Reminders only for sales role */}
      {userRole === 'sales' && (
        <>
          {/* Notes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Notatki</h2>
            <form onSubmit={handleNoteSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Treść notatki"
                className="border p-2 rounded flex-1"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Dodaj
              </button>
            </form>
            {notes.length === 0 ? (
              <p className="text-gray-500">Brak notatek.</p>
            ) : (
              <ul className="list-disc pl-6 space-y-1">
                {notes.map(note => (
                  <li key={note._id} className="flex items-center justify-between">
                    <span>{note.content}</span>
                    <button
                      onClick={() => handleNoteDelete(note._id)}
                      className="text-red-600 hover:underline"
                    >
                      Usuń
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reminders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Przypomnienia</h2>
            <form onSubmit={handleReminderSubmit} className="flex gap-2 mb-4 flex-wrap">
              <input
                type="text"
                value={reminderTitle}
                onChange={e => setReminderTitle(e.target.value)}
                placeholder="Tytuł przypomnienia"
                className="border p-2 rounded flex-1"
                required
              />
              <input
                type="date"
                value={reminderDueDate}
                onChange={e => setReminderDueDate(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Dodaj
              </button>
            </form>
            {reminders.length === 0 ? (
              <p className="text-gray-500">Brak przypomnień.</p>
            ) : (
              <ul className="list-disc pl-6 space-y-1">
                {reminders.map(rem => (
                  <li key={rem._id} className="flex items-center justify-between">
                    <span className={rem.isDone ? "line-through text-gray-400" : ""}>
                      {rem.title} (do: {new Date(rem.dueDate).toLocaleDateString()})
                    </span>
                    <span>
                      {!rem.isDone && (
                        <button
                          onClick={() => handleReminderDone(rem._id)}
                          className="text-green-600 hover:underline mr-2"
                        >
                          Oznacz jako wykonane
                        </button>
                      )}
                      <button
                        onClick={() => handleReminderDelete(rem._id)}
                        className="text-red-600 hover:underline"
                      >
                        Usuń
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sales */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Transakcje</h2>
            <form onSubmit={handleSaleSubmit} className="flex gap-2 mb-4 flex-wrap">
              <input
                type="text"
                name="title"
                value={saleForm.title}
                onChange={handleSaleChange}
                placeholder="Tytuł"
                className="border p-2 rounded flex-1"
                required
              />
              <input
                type="number"
                name="value"
                value={saleForm.value}
                onChange={handleSaleChange}
                placeholder="Wartość"
                className="border p-2 rounded"
                required
                min={0}
              />
              <select
                name="status"
                value={saleForm.status}
                onChange={handleSaleChange}
                className="border p-2 rounded"
              >
                <option value="lead">Lead</option>
                <option value="contacted">Skontaktowany</option>
                <option value="negotiation">Negocjacje</option>
                <option value="won">Wygrany</option>
                <option value="lost">Przegrany</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingSaleId ? 'Zapisz' : 'Dodaj'}
              </button>
              {editingSaleId && (
                <button
                  type="button"
                  onClick={() => {
                    setSaleForm({ title: '', value: '', status: 'lead' });
                    setEditingSaleId(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Anuluj
                </button>
              )}
            </form>
          </div>
        </>
      )}

      {/* Sales table for all */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Transakcje</h2>
        {sales.length === 0 ? (
          <p className="text-gray-500">Brak transakcji.</p>
        ) : (
          <table className="min-w-full border border-gray-300 rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Tytuł</th>
                <th className="border px-4 py-2 text-left">Wartość</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Data utworzenia</th>
                {userRole === 'sales' && <th className="border px-4 py-2 text-left">Akcje</th>}
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale._id}>
                  <td className="border px-4 py-2">{sale.title}</td>
                  <td className="border px-4 py-2">{sale.value} PLN</td>
                  <td className="border px-4 py-2">{sale.status}</td>
                  <td className="border px-4 py-2">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  {userRole === 'sales' && (
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleSaleEdit(sale)}
                        className="text-yellow-600 hover:underline mr-2"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleSaleDelete(sale._id)}
                        className="text-red-600 hover:underline"
                      >
                        Usuń
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}