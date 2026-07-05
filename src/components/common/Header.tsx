import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  cartCount?: number;
}

export function Header({ title, showBack = true, showCart = true, cartCount = 0 }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-dark-bg/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="w-12">
        {showBack && (
          <button
            onClick={() => navigate('/app/home')}
            className="text-white hover:text-purple-400 transition-colors text-xl"
          >
            ◀
          </button>
        )}
      </div>

      <h1 className="text-white text-lg font-bold">{title}</h1>

      <div className="w-12 flex justify-end">
        {showCart && (
          <button
            onClick={() => navigate('/app/orders')}
            className="relative text-white hover:text-purple-400 transition-colors"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}