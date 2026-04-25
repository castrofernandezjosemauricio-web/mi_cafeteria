import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Mail, Lock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      onLogin();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-4 rounded-2xl shadow-xl shadow-indigo-500/20 mb-4">
            <Coffee size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
          <p className="text-text-muted mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="pl-12"
                placeholder="admin@cafeteria.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="pl-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-text-muted text-sm">
          ¿Problemas para ingresar? <a href="#" className="text-primary hover:underline">Contacta a soporte</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
