import React, { useState } from 'react';
import TigoLogo from '../assets/TigoLogo';

const LoginScreen = ({ onLogin, providerLabel = 'fake' }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña requeridos');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onLogin({
        username,
        email: username,
        password,
      });
    } catch (loginError) {
      setError(loginError.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center space-y-4">
      <TigoLogo className="h-12 mx-auto" />
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-800">Iniciar Sesion</h2>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        type="text"
        placeholder={providerLabel === 'supabase' ? 'Correo' : 'Usuario demo'}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />
      <input
        type="password"
        placeholder="Contrasena"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:transform-none"
      >
        {loading ? 'Ingresando...' : 'Iniciar sesion'}
      </button>
    </div>
  );
};

export default LoginScreen;
