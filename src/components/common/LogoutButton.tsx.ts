import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useAppStore } from '@/stores/appStore';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoutButtonProps {
  variant?: 'icon' | 'text';
}

export function LogoutButton({ variant = 'icon' }: LogoutButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logout } = useUser();
  const { lock } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    lock();
    navigate('/gate', { replace: true });
    setShowConfirm(false);
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConfirm(!showConfirm)}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ⚡
        </button>

        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-8 bg-dark-card rounded-xl shadow-xl border border-gray-700 p-3 w-48 z-50"
            >
              <p className="text-white text-sm text-center mb-3">Logout?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-400 hover:text-red-300 text-sm transition-colors"
    >
      🚪 Logout
    </button>
  );
}