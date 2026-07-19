import { useState } from 'react';
import { motion } from 'framer-motion';
import { PasswordGateProps } from '@/types';

// Load the hash from environment variable, with fallback
const CORRECT_PASSWORD_HASH = import.meta.env.VITE_PASSWORD_HASH || 'a3e7399bdb5a551a630cd420d803da3919ee0277c27667983d0137d3d7779c21';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>

        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '8px',
          }}
        >
          SilphCo Access
        </h2>
        <p
          style={{
            color: '#888888',
            fontSize: '14px',
            marginBottom: '32px',
          }}
        >
          Enter the access code to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Access Code"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: error ? '2px solid #F44336' : '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            autoFocus
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !password}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading || !password ? '#555555' : '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isLoading || !password ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && password) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && password) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5';
              }
            }}
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </button>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: '#F44336',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              ⚠️ Incorrect code, try again.
            </motion.p>
          )}
        </form>
      </div>
    </div>
  );
}