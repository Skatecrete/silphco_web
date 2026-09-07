// src/components/chat/ChatBubble.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { getMessages } from '@/services/chatApi';

export function ChatBubble() {
  const navigate = useNavigate();
  const { userDisplay } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatName, setChatName] = useState(() => {
    return localStorage.getItem('chat_name') || '';
  });

  // Check for new messages every 20 seconds
  useEffect(() => {
    if (!chatName) return;

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
  }, [chatName]);

  const handleClick = () => {
    if (!chatName) {
      navigate('/app/chat'); // Will show name selection
    } else {
      navigate('/app/chat');
    }
  };

  // Don't show on login/gate/landing pages
  if (window.location.hash.includes('/app/login') || 
      window.location.hash.includes('/gate') || 
      window.location.hash === '' ||
      window.location.hash === '#/') {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
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
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'transform 0.2s',
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