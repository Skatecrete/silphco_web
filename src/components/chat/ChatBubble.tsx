// src/components/chat/ChatBubble.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMessages } from '@/services/chatApi';

export function ChatBubble() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const chatName = localStorage.getItem('chat_name') || '';
  const isLoggedIn = !!chatName;

  // Check for new messages every 20 seconds
  useEffect(() => {
    if (!chatName || !isLoggedIn) return;

    const checkUnread = async () => {
      try {
        const data = await getMessages(chatName);
        const count = data.messages?.filter((m: any) => m.isNew).length || 0;
        setUnreadCount(count);
      } catch (e) {
        console.error('Error checking unread:', e);
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 20000);
    return () => clearInterval(interval);
  }, [chatName, isLoggedIn]);

  const handleClick = () => {
    if (!isLoggedIn) {
      navigate('/app/login');
      return;
    }
    navigate('/app/chat');
  };

  // Check if we're on the home or orders page
  // Use both pathname and hash for mobile compatibility
  const pathname = location.pathname;
  const hash = window.location.hash;
  
  // Check if on home page (any variant)
  const isHome = pathname === '/app/home' || 
                 pathname === '/app/' || 
                 pathname === '/home' ||
                 hash.includes('/app/home') ||
                 hash.includes('home') ||
                 hash === '#/app/home';
  
  // Check if on orders page
  const isOrders = pathname === '/app/orders' || 
                   pathname === '/orders' ||
                   hash.includes('/app/orders') ||
                   hash.includes('orders') ||
                   hash === '#/app/orders';

  // Only show on Home or Orders pages
  if (!isHome && !isOrders) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '120px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* Label above bubble */}
      <span
        style={{
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: 'rgba(26, 26, 46, 0.85)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(118, 39, 197, 0.3)',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        💬 Chat with SilphCo
      </span>

      {/* Chat Bubble Button */}
      <button
        onClick={handleClick}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#7627C5',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(118, 39, 197, 0.4)',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
          position: 'relative',
          overflow: 'visible',
          touchAction: 'manipulation', // Better for mobile
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(118, 39, 197, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(118, 39, 197, 0.4)';
        }}
        // Mobile touch feedback
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        💬
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ❗
          </span>
        )}
      </button>
    </div>
  );
}
