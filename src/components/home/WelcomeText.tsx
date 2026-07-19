import { useUser } from '@/hooks/useUser';

export function WelcomeText() {
  const { getWelcomeName } = useUser();
  const name = getWelcomeName();

  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: '80%',
      }}
    >
      <span
        style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          maxWidth: '100%',
        }}
      >
        Welcome, <span style={{ color: '#a855f7' }}>{name}</span>!
      </span>
    </div>
  );
}