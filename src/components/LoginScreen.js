import React, { useState } from 'react';
import TigoLogo from '../assets/TigoLogo';

/**
 * Pantalla de inicio de sesión.
 *
 * Es un formulario visual que luego se conectará
 * con el backend para autenticar al usuario.
 */
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña requeridos');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center space-y-4">
      <TigoLogo className="h-12 mx-auto" />
      <h2 className="text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Iniciar sesión
      </button>
    </div>
  );
};

export default LoginScreen;

