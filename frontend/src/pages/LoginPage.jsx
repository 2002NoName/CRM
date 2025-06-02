import React, { useState } from 'react';
import axios from '../api/axiosConfig'; // axios skonfigurowany z baseURL '/api'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Register
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      navigate('/clients'); // Redirect to clients page after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd logowania');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('api/auth/register', {
        email: registerEmail,
        password: registerPassword,
        name: registerName,
      });
      alert('Rejestracja zakończona sukcesem, możesz się teraz zalogować');
      setIsRegister(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd rejestracji');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{isRegister ? 'Rejestracja' : 'Logowanie'}</h1>

        {error && (
          <p className="mb-4 text-red-600 text-center">{error}</p>
        )}

        {isRegister ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Imię i nazwisko"
              value={registerName}
              onChange={e => setRegisterName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Hasło"
              value={registerPassword}
              onChange={e => setRegisterPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Zarejestruj się
            </button>
            <p className="text-center mt-2">
              Masz już konto?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className="text-blue-600 hover:underline"
              >
                Zaloguj się
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Hasło"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Zaloguj się
            </button>
            <p className="text-center mt-2">
              Nie masz konta?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className="text-green-600 hover:underline"
              >
                Zarejestruj się
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
