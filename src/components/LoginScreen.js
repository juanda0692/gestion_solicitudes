import React, { useState } from 'react';
import TigoLogo from '../assets/TigoLogo';

const LoginScreen = ({ onLogin, providerLabel = 'fake' }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Usuario y contrasena requeridos');
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
    <div className="ui-card p-6 sm:p-7 max-w-md mx-auto text-center space-y-4 sm:space-y-5">
      <TigoLogo className="h-12 mx-auto" />
      <div className="space-y-1">
        <h2 className="ui-title text-2xl">Iniciar sesion</h2>
        <p className="ui-subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      {error && (
        <p role="alert" className="ui-banner-error text-left">
          <span className="font-semibold">Error:</span> {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
        <input
          type="text"
          name="username"
          autoComplete={providerLabel === 'supabase' ? 'username' : 'off'}
          aria-label="Usuario o correo"
          placeholder={providerLabel === 'supabase' ? 'Correo' : 'Usuario demo'}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="ui-input"
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          aria-label="Contrasena"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="ui-input"
        />
        <button type="submit" disabled={loading} className="ui-btn ui-btn-primary flex items-center justify-center gap-2">
          {loading && <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />}
          {loading ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
