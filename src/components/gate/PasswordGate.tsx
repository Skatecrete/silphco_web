import { useState } from 'react';
import { motion } from 'framer-motion';
import { PasswordGateProps } from '@/types';

// SHA-256 hash of: @n3R1ng#01031&92
const CORRECT_PASSWORD_HASH = 'dc236f8e98ccdfa602aaacd6e83396c46eb18a35002b0c19536160772ac5872a';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    const hashedInput = await hashPassword(password);

    if (hashedInput === CORRECT_PASSWORD_HASH) {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-sm w-full"
      >
        <div className="text-6xl mb-6">🔒</div>

        <h2 className="text-2xl font-bold text-white mb-2">SilphCo Access</h2>
        <p className="text-gray-400 text-sm mb-8">Enter the access code to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Access Code"
            className={`
              w-full px-4 py-3 bg-dark-card text-white rounded-xl border-2 
              focus:outline-none focus:border-purple-500 transition-colors
              ${error ? 'border-red-500' : 'border-transparent'}
            `}
            autoFocus
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !password}
            className={`
              w-full py-3 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-xl 
              transition-colors duration-200 shadow-lg shadow-purple-500/25
              ${(isLoading || !password) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </button>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              ⚠️ Incorrect code, try again.
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
}