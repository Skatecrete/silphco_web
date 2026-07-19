import { useNavigate } from 'react-router-dom';

const APK_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1YVsTEIqoS6vvQ0j020MS-0sTbwUPSK8t';

export function LandingPage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/gate');
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
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '4px',
            marginBottom: '16px',
          }}
        >
          SILPHCO
        </h1>

        <p
          style={{
            color: '#888888',
            fontSize: '18px',
            marginBottom: '32px',
          }}
        >
          Welcome to the SilphCo Operations Hub
        </p>

        {/* Web App Button */}
        <button
          onClick={handleEnter}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'background-color 0.2s, transform 0.1s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5';
          }}
          onMouseDown={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          Our Web App
        </button>

        {/* APK Download Button */}
        <a
          href={APK_DOWNLOAD_URL}
          download
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            backgroundColor: '#388E3C',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'background-color 0.2s, transform 0.1s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLAnchorElement).style.backgroundColor = '#2E7D32';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLAnchorElement).style.backgroundColor = '#388E3C';
          }}
        >
          📱 Download Android App
        </a>

        <p
          style={{
            color: '#555555',
            fontSize: '12px',
            marginTop: '12px',
          }}
        >
          Android APK • Version 1.0
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          color: '#444444',
          fontSize: '14px',
        }}
      >
        © SilphCo
      </div>
    </div>
  );
}