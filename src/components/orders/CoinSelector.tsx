interface CoinSelectorProps {
  prices: {
    coins5600: number;
    coins15500: number;
    coins31000: number;
  };
  onAddCoin: (amount: number) => void;
}

export function CoinSelector({ prices, onAddCoin }: CoinSelectorProps) {
  return (
    <div className="bg-dark-card rounded-xl p-4 mb-4">
      <p className="text-white font-bold mb-3">💰 ADD COINS TO ORDER</p>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onAddCoin(5600)}
          className="py-3 bg-purple-500 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors"
        >
          5,600
          <br />
          ${prices.coins5600}
        </button>
        <button
          onClick={() => onAddCoin(15500)}
          className="py-3 bg-purple-500 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors"
        >
          15,500
          <br />
          ${prices.coins15500}
        </button>
        <button
          onClick={() => onAddCoin(31000)}
          className="py-3 bg-purple-500 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors"
        >
          31,000
          <br />
          ${prices.coins31000}
        </button>
      </div>
    </div>
  );
}