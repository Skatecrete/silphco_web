import { useState, useEffect, useRef } from 'react';
import { getMessages } from '@/services/chatApi';

const POLL_INTERVAL = 20000;

export function useMessageWatcher() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const lastCountRef = useRef(0);

  useEffect(() => {
    const chatName = localStorage.getItem('chat_name') || '';
    if (!chatName) return;

    const check = async () => {
      // Skip on the chat page itself — ChatWindow already polls there.
      const hash = window.location.hash || '';
      if (hash.startsWith('#/app/chat')) {
        return;
      }

      try {
        const data = await getMessages(chatName);
        const messages = data.messages || [];
        const newCount = messages.filter((m: any) => m.isNew).length;

        // Only reset the dismissed flag when the count actually increases.
        if (newCount > lastCountRef.current) {
          setDismissed(false);
        }
        lastCountRef.current = newCount;
        setUnreadCount(newCount);
      } catch (e) {
        // Silent — never break the app over a poll failure.
      }
    };

    check();
    const interval = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    show: unreadCount > 0 && !dismissed,
    unreadCount,
    dismiss: () => setDismissed(true),
  };
}