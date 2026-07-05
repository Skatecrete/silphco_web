import { useUser } from '@/hooks/useUser';

export function WelcomeText() {
  const { getWelcomeName } = useUser();
  const name = getWelcomeName();

  return (
    <div className="text-center">
      <p className="text-white text-sm font-medium truncate max-w-[180px]">
        Welcome, <span className="text-purple-400">{name}</span>!
      </p>
    </div>
  );
}