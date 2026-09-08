// src/components/chat/ChatWindow.tsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage, getMessages, markRead } from '@/services/chatApi';

interface Message {
  timestamp: string;
  user: string;
  message: string | null;
  adminReply: string | null;
  isNew: boolean;
}

// ========== HELPER: Format Timestamp ==========
const formatChatTimestamp = (timestamp: string): string => {
  try {
    if (timestamp.includes('/')) {
      const parts = timestamp.split(' ');
      if (parts.length === 2) {
        const dateParts = parts[0].split('/');
        if (dateParts.length === 3) {
          const month = dateParts[0].padStart(2, '0');
          const day = dateParts[1].padStart(2, '0');
          const timePart = parts[1].substring(0, 5);
          return `${month}/${day} ${timePart}`;
        }
      }
    }
    
    const parts = timestamp.split('T');
    if (parts.length === 2) {
      const datePart = parts[0].split('-');
      if (datePart.length === 3) {
        const month = datePart[1];
        const day = datePart[2];
        let timePart = parts[1].split('.')[0];
        timePart = timePart.substring(0, 5);
        return `${month}/${day} ${timePart}`;
      }
    }
    
    return timestamp;
  } catch (e) {
    return timestamp;
  }
};

export function ChatWindow() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCache = useRef<Message[]>([]);
  const isFirstLoad = useRef(true);

  const chatName = localStorage.getItem('chat_name') || '';
  const isLoggedIn = !!chatName;

  // ========== Load messages with caching ==========
  const loadMessages = useCallback(async () => {
    if (!chatName) return;
    
    try {
      const data = await getMessages(chatName);
      const newMessages = data.messages || [];
      
      // Check if messages have actually changed
      const currentMessages = messageCache.current;
      const hasChanged = currentMessages.length !== newMessages.length ||
        currentMessages.some((msg, index) => {
          const newMsg = newMessages[index];
          return !newMsg || 
            msg.message !== newMsg.message ||
            msg.adminReply !== newMsg.adminReply ||
            msg.isNew !== newMsg.isNew;
        });
      
      if (hasChanged) {
        console.log('📝 Messages changed, updating...');
        messageCache.current = newMessages;
        setMessages(newMessages);
        
        // Mark new messages as read
        const hasNew = newMessages.some((m: Message) => m.isNew);
        if (hasNew) {
          await markRead(chatName);
          // After marking read, update the cache to reflect the change
          const updatedData = await getMessages(chatName);
          messageCache.current = updatedData.messages || [];
          setMessages(messageCache.current);
        }
      } else {
        console.log('📝 No changes to messages');
      }
      
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        setHasLoaded(true);
        setIsLoading(false);
      }
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error('Error loading messages:', e);
      if (isFirstLoad.current) {
        setIsLoading(false);
      }
    }
  }, [chatName]);

  // ========== Send message ==========
  const handleSend = async () => {
    if (!input.trim() || !chatName) return;
    
    setLoading(true);
    try {
      await sendMessage(chatName, input.trim());
      setInput('');
      // Immediately show the sent message by adding it to the cache
      const now = new Date();
      const timestamp = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const newMessage: Message = {
        timestamp: timestamp,
        user: chatName,
        message: input.trim(),
        adminReply: null,
        isNew: false
      };
      const updatedCache = [...messageCache.current, newMessage];
      messageCache.current = updatedCache;
      setMessages(updatedCache);
      
      // Then reload to get the server-saved version with correct timestamp
      setTimeout(() => loadMessages(), 500);
    } catch (e) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ========== Initial load and polling ==========
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/app/login');
      return;
    }

    if (chatName) {
      loadMessages();
      // Poll every 20 seconds using the cached version
      const interval = setInterval(() => {
        console.log('🔄 Polling for new messages...');
        loadMessages();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [chatName, isLoggedIn, loadMessages]);

  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e', padding: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          Please Sign In
        </h2>
        <p style={{ color: '#888888', fontSize: '14px', textAlign: 'center' }}>
          You need to be logged in to chat with admin.
        </p>
        <button
          onClick={() => navigate('/app/login')}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#1a1a2e', 
      overflow: 'hidden',
      width: '100%',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#2a2a3e', 
        borderBottom: '1px solid #3a3a4e',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        minHeight: '60px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ◀
        </button>
        <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700 }}>Chat with Admin</span>
        <span style={{ color: '#888888', fontSize: '11px', marginLeft: 'auto', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {chatName}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' }}>
        {isLoading && !hasLoaded ? (
          // Loading state - only shows on first load
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              border: '2px solid rgba(118, 39, 197, 0.15)', 
              borderTopColor: 'rgba(118, 39, 197, 0.5)', 
              borderRadius: '50%', 
              animation: 'spin 0.8s linear infinite' 
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>
              Note: Past messages may take up to a minute to load when opening chat
            </p>
            <p style={{ fontSize: '18px', marginTop: '16px' }}>No messages yet</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Send a message below to start chatting</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              {msg.message && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '80%', backgroundColor: '#7627C5', padding: '10px 14px', borderRadius: '12px', borderBottomRightRadius: '4px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', margin: 0, wordBreak: 'break-word' }}>{msg.message}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                      {formatChatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )}
              
              {msg.adminReply && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                  <div style={{ maxWidth: '80%', backgroundColor: '#2a2a3e', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '4px', border: '1px solid #3a3a4e' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', margin: 0, wordBreak: 'break-word' }}>
                      👤 Admin: {msg.adminReply}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>
                      {formatChatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: '12px 16px', 
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 20px))',
        backgroundColor: '#2a2a3e', 
        borderTop: '1px solid #3a3a4e', 
        flexShrink: 0 
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            style={{
              flex: 1,
              padding: '10px 14px',
              backgroundColor: '#1a1a2e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #3a3a4e',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'none',
              minHeight: '44px',
              maxHeight: '120px',
              WebkitAppearance: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#7627C5'; }}
            onBlur={(e) => { e.target.style.borderColor = '#3a3a4e'; }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: (loading || !input.trim()) ? '#555555' : '#4CAF50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              minHeight: '44px',
              minWidth: '70px',
              transition: 'background-color 0.2s',
              touchAction: 'manipulation',
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        <p style={{ color: '#666666', fontSize: '11px', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>
          *Messages are automatically deleted after 30 days
        </p>
      </div>
    </div>
  );
}
