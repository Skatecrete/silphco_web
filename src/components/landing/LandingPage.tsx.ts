import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function LandingPage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/gate');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        {/* SilphCo Logo/Brand */}
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wider mb-4">
          SILPHCO
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-8">
          Welcome to the SilphCo Operations Hub
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnter}
          className="px-8 py-4 bg-purple-500 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-colors duration-200 shadow-lg shadow-purple-500/25"
        >
          Our Web App
        </motion.button>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-gray-600 text-sm">
        © SilphCo
      </div>
    </div>
  );
}