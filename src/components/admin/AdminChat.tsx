// src/components/admin/AdminChat.tsx

import { useState, useEffect, useRef } from 'react';
import { getAllUsers, getMessages, adminReply } from '@/services/chatApi';

interface User {
  user: string;
  lastMessage: string;
  hasUnreadReply: boolean;
}

interface Message {
  timestamp: string;
  user: string;
  message: string | null;
  adminReply: string | null;
  isNew: boolean;
}

export function AdminChat() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (e) {
      console.error('Error loading users:', e);
    }
  };

  const loadUserMessages = async (user: string) => {
    try {
      const data = await getMessages(user);
      setMessages(data.messages || []);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error('Error loading user messages:', e);
    }
  };

  const handleSendReply = async () => {
    if (!selectedUser || !input.trim()) return;
    
    setLoading(true);
    try {
      await adminReply(selectedUser, input.trim());
      setInput('');
      await loadUserMessages(selectedUser);
      await loadUsers(); // Refresh user list
    } catch (e) {
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // Load users on mount
  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 20000);
    return () => clearInterval(interval);
  }, []);

  // Load messages when user changes
  useEffect(() => {
    if (selectedUser) {
      loadUserMessages(selectedUser);
    }
  }, [selectedUser]);

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#1a1a2e' }}>
      {/* Left Panel - User List */}
      <div style={{ 
        width: '280px', 
        borderRight: '1px solid #2a2a3e', 
        overflowY: 'auto',
        flexShrink: 0,
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #2a2a3e' }}>
          <h2 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: 0 }}>
            💬 Chats ({users.length})
          </h2>
        </div>
        {users.length === 0 ? (
          <div style={{ padding: '16px', color: '#888888', fontSize: '14px', textAlign: 'center' }}>
            No users yet
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.user}
              onClick={() => setSelectedUser(user.user)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: selectedUser === user.user ? '#2a2a3e' : 'transparent',
                borderBottom: '1px solid #1a1a2e',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#ffffff', fontSize: '14px' }}>{user.user}</span>
              {user.hasUnreadReply && (
                <span style={{ color: '#FFA500', fontSize: '12px' }}>⬅️ New</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Right Panel - Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a3e' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>💬 {selectedUser}</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {messages.length === 0 ? (
                <div style={{ color: '#888888', textAlign: 'center', paddingTop: '32px' }}>
                  No messages from this user yet
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    {/* User message */}
                    {msg.message && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ maxWidth: '70%', backgroundColor: '#7627C5', padding: '8px 12px', borderRadius: '8px', borderBottomRightRadius: '4px' }}>
                          <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>{msg.message}</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Admin reply */}
                    {msg.adminReply && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                        <div style={{ maxWidth: '70%', backgroundColor: '#2a2a3e', padding: '8px 12px', borderRadius: '8px', borderBottomLeftRadius: '4px', border: '1px solid #3a3a4e' }}>
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

            {/* Reply Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #2a2a3e', display: 'flex', gap: '8px' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply..."
                rows={1}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: '#1a1a2e',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #2a2a3e',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  minHeight: '44px',
                  maxHeight: '80px',
                }}
              />
              <button
                onClick={handleSendReply}
                disabled={loading || !input.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (loading || !input.trim()) ? '#555555' : '#4CAF50',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                }}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}