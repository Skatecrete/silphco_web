// src/components/chat/ChatWindow.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { sendMessage, getMessages, markRead } from '@/services/chatApi';
import { Header } from '@/components/common/Header';

interface Message {
  timestamp: string;
  user: string;
  message: string | null;
  adminReply: string | null;
  isNew: boolean;
}

export function ChatWindow() {
  const navigate = useNavigate();
  const { userDisplay } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState(() => {
    return localStorage.getItem('chat_name') || '';
  });
  const [showNameSelection, setShowNameSelection] = useState(!chatName);
  const [notificationPrompt, setNotificationPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages
  const loadMessages = async () => {
    if (!chatName) return;
    try {
      const data = await getMessages(chatName);
      setMessages(data.messages || []);
      
      const hasNew = data.messages?.some((m: Message) => m.isNew);
      if (hasNew) {
        await markRead(chatName);
        // Show notification prompt if not already shown
        if (!localStorage.getItem('notification_shown')) {
          setNotificationPrompt(true);
        }
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

  // Notification prompt response
  const handleNotificationResponse = (allow: boolean) => {
    setNotificationPrompt(false);
    localStorage.setItem('notification_shown', 'true');
    if (allow) {
      // Initialize OneSignal
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.async = true;
      script.onload = () => {
        if (window.OneSignal) {
          window.OneSignal.showSlidedown({
            text: {
              message: `Allow PokeSpawn by SilphCo to send notifications when an admin responds?`,
            },
            buttons: {
              accept: 'Allow',
              cancel: "Don't Allow",
            },
          });
        }
      };
      document.head.appendChild(script);
    }
  };

  // Name selection
  const handleNameSelect = (name: string) => {
    if (!name) return;
    localStorage.setItem('chat_name', name);
    setChatName(name);
    setShowNameSelection(false);
    loadMessages();
  };

  // Load initial messages and start polling
  useEffect(() => {
    if (!showNameSelection && chatName) {
      loadMessages();
      const interval = setInterval(loadMessages, 20000);
      return () => clearInterval(interval);
    }
  }, [showNameSelection, chatName]);

  // Name selection screen
  if (showNameSelection) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="Chat with Admin" showCart={false} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
            Who are you?
          </h2>
          <p style={{ color: '#888888', fontSize: '14px', marginBottom: '16px' }}>
            Select your name to start chatting
          </p>
          <select
            onChange={(e) => handleNameSelect(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '12px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          >
            <option value="">Select your name...</option>
            <option value={userDisplay || 'Guest'}>{userDisplay || 'Guest'}</option>
            <option value="Mike (Death187Knight)">Mike (Death187Knight)</option>
            <option value="TJ (DrugDoc2000)">TJ (DrugDoc2000)</option>
            <option value="Aaron (Aaron13524)">Aaron (Aaron13524)</option>
            <option value="Meagan (Sharkie1231)">Meagan (Sharkie1231)</option>
            <option value="Chris (infvet05)">Chris (infvet05)</option>
            <option value="Skate (Skatecrete)">Skate (Skatecrete)</option>
            <option value="Other">Other</option>
          </select>
          <p style={{ color: '#666666', fontSize: '11px', marginTop: '16px', fontStyle: 'italic' }}>
            *Messages are automatically deleted after 30 days
          </p>
        </div>
      </div>
    );
  }

  // Main chat view
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="Chat with Admin" showCart={false} />

      {/* Notification Prompt */}
      {notificationPrompt && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#2a1a3e', 
          borderBottom: '1px solid #3a2a4e',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ color: '#ffffff', fontSize: '13px', margin: 0 }}>
              🔔 Allow PokeSpawn by SilphCo to send notifications when an admin responds?
            </p>
            <p style={{ color: '#888888', fontSize: '11px', marginTop: '4px' }}>
              A red ❗ will appear on your chat bubble when an admin responds.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => handleNotificationResponse(false)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#444444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Don't Allow
            </button>
            <button
              onClick={() => handleNotificationResponse(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Allow
            </button>
          </div>
        </div>
      )}

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
      <div style={{ padding: '12px 16px', backgroundColor: '#2a2a3e', borderTop: '1px solid #3a3a4e' }}>
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