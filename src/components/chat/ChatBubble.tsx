// src/components/chat/ChatBubble.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessages } from '@/services/chatApi';

export function ChatBubble() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Get chat name from localStorage (set when user first opens chat)
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

  // Don't show on login/gate/landing pages
  const path = window.location.hash;
  if (path.includes('/app/login') || path.includes('/gate') || path === '' || path === '#/' || path === '#') {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#7627C5',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 4px 12px rgba(118, 39, 197, 0.4)',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s',
        overflow: 'visible',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
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
  );
}
