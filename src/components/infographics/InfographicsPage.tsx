import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { InfographicGallery } from './InfographicGallery';

const WEEKLY_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/weekly_events.png';
const MONTHLY_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/monthly_events.png';
const ALL_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/all_events.png';

export function InfographicsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'buttons' | 'gallery'>('buttons');

  const loadInfographic = (filename: string, title: string) => {
    const imageUrl = `https://raw.githubusercontent.com/Skatecrete/infographics/main/images/${filename}`;
    showImageModal(imageUrl, title);
  };

  const showImageModal = (imageUrl: string, title: string) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a2e;
      border-radius: 16px;
      padding: 16px;
      max-width: 90vw;
      max-height: 90vh;
      position: relative;
    `;

    modal.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="color:#ffffff; font-size:18px; font-weight:700; margin:0;">${title}</h3>
        <button id="closeModalBtn" style="background:#F44336; color:#fff; border:none; border-radius:50%; width:32px; height:32px; font-size:18px; cursor:pointer;">✕</button>
      </div>
      <img src="${imageUrl}" style="max-width:100%; max-height:70vh; border-radius:8px; display:block;" />
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  };

  if (viewMode === 'gallery') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
        <Header title="Infographics" showCart={true} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          <button
            onClick={() => setViewMode('buttons')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            ← Back
          </button>
          <InfographicGallery />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="Infographics" showCart={true} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            maxWidth: '500px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Weekly Button - container matches image size */}
          <div
            onClick={() => loadInfographic('weekly.png', 'Events This Week')}
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: '#2a2a3e',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <img
              src={WEEKLY_IMAGE}
              alt="Weekly Events"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Monthly Button - container matches image size */}
          <div
            onClick={() => loadInfographic('monthly.png', 'Events This Month')}
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: '#2a2a3e',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <img
              src={MONTHLY_IMAGE}
              alt="Monthly Events"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* All Events Button - container matches image size */}
          <div
            onClick={() => setViewMode('gallery')}
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: '#2a2a3e',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <img
              src={ALL_IMAGE}
              alt="All Events"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '12px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}