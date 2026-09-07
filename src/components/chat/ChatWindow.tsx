// src/components/chat/ChatWindow.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { sendMessage, getMessages, markRead } from '@/services/chatApi';

interface Message {
  timestamp: string;
  user: string;
  message: string | null;
  adminReply: string | null;
  isNew: boolean;
}

export function ChatWindow() {
  const navigate = useNavigate();
  const { userDisplay, isLoggedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the logged-in user's display name
  const chatName = userDisplay || '';

  // Load messages
  const loadMessages = async () => {
    if (!chatName) return;
    try {
      const data = await getMessages(chatName);
      setMessages(data.messages || []);
      
      const hasNew = data.messages?.some((m: Message) => m.isNew);
      if (hasNew) {
        await markRead(chatName);
      }
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error('Error loading messages:', e);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !chatName) return;
    
    setLoading(true);
    try {
      await sendMessage(chatName, input.trim());
      setInput('');
      await loadMessages();
    } catch (e) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Load messages and start polling
  useEffect(() => {
    // If not logged in, redirect to login
    if (!isLoggedIn) {
      navigate('/app/login');
      return;
    }

    if (chatName) {
      loadMessages();
      const interval = setInterval(loadMessages, 20000);
      return () => clearInterval(interval);
    }
  }, [chatName, isLoggedIn]);

  // If not logged in, show message
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

  // Main chat view
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#2a2a3e', 
        borderBottom: '1px solid #3a3a4e',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ◀
        </button>
        <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700 }}>Chat with Admin</span>
        <span style={{ color: '#888888', fontSize: '12px', marginLeft: 'auto' }}>{chatName}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
            <p style={{ fontSize: '18px' }}>No messages yet</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Send a message below to start chatting</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              {/* User message */}
              {msg.message && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '80%', backgroundColor: '#7627C5', padding: '10px 14px', borderRadius: '12px', borderBottomRightRadius: '4px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>{msg.message}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Admin reply */}
              {msg.adminReply && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                  <div style={{ maxWidth: '80%', backgroundColor: '#2a2a3e', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '4px', border: '1px solid #3a3a4e' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>👤 {msg.adminReply}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>
                      {msg.timestamp}
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
      <div style={{ padding: '12px 16px', backgroundColor: '#2a2a3e', borderTop: '1px solid #3a3a4e', flexShrink: 0 }}>
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
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none',
              minHeight: '44px',
              maxHeight: '120px',
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
              fontSize: '14px',
              fontWeight: 700,
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              minHeight: '44px',
              transition: 'background-color 0.2s',
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
