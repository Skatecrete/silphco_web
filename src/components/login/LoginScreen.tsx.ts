import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, guestLogin, isLoggedIn } = useUser();
  const [name, setName] = useState('');
  const [ign, setIgn] = useState('');
  const [error, setError] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/app/home', { replace: true });
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedIgn = ign.trim();

    if (!trimmedName || !trimmedIgn) {
      setError(true);
      return;
    }

    setError(false);
    login(trimmedName, trimmedIgn);
    navigate('/app/home', { replace: true });
  };

  const handleGuest = () => {
    guestLogin();
    navigate('/app/home', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-3xl bg-purple-500/20 flex items-center justify-center overflow-hidden">
            {/* Replace with login_logo.png later */}
            <span className="text-5xl">🎯</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1">PokeSpawn</h1>
        <p className="text-gray-400 text-center mb-8">Welcome back, Trainer!</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(false);
            }}
            placeholder="Your First Name *"
            className={`
              w-full px-4 py-3 bg-dark-card text-white rounded-xl border-2
              focus:outline-none focus:border-purple-500 transition-colors
              ${error ? 'border-red-500' : 'border-transparent'}
            `}
            autoFocus
          />

          <input
            type="text"
            value={ign}
            onChange={(e) => {
              setIgn(e.target.value);
              setError(false);
            }}
            placeholder="In-Game Name (PoGo Name) *"
            className={`
              w-full px-4 py-3 bg-dark-card text-white rounded-xl border-2
              focus:outline-none focus:border-purple-500 transition-colors
              ${error ? 'border-red-500' : 'border-transparent'}
            `}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              Please enter both name and in-game name
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors duration-200 shadow-lg shadow-purple-500/25"
          >
            CONTINUE TO POGO BLISS!
          </button>
        </form>

        <button
          onClick={handleGuest}
          className="w-full mt-3 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors duration-200"
        >
          Continue as Guest
        </button>

        <p className="text-orange-500 text-xs text-center mt-4 leading-relaxed">
          *Continue as Guest if you don't wish to have<br />
          your order history or dex progress saved.
        </p>
      </motion.div>
    </div>
  );
}