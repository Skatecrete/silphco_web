// src/services/chatApi.ts

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6i6Yn7ezXqwJKgZF3Mbq_MbgNeb4mQ8weT0Qipu0c9ASFRVK6l-HIdH83xFbJOeI4/exec';

// ========== USER FUNCTIONS ==========

export async function sendMessage(user: string, message: string): Promise<any> {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'sendMessage',
      user: user,
      message: message,
    }),
  });
  return response.json();
}

export async function getMessages(user: string): Promise<any> {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'getMessages',
      user: user,
    }),
  });
  return response.json();
}

export async function markRead(user: string): Promise<any> {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'markRead',
      user: user,
    }),
  });
  return response.json();
}

// ========== ADMIN FUNCTIONS ==========

export async function adminReply(user: string, reply: string): Promise<any> {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'adminReply',
      user: user,
      reply: reply,
    }),
  });
  return response.json();
}

export async function getAllUsers(): Promise<any> {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'getAllUsers',
    }),
  });
  return response.json();
}