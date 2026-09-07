// src/services/chatApi.ts

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6i6Yn7ezXqwJKgZF3Mbq_MbgNeb4mQ8weT0Qipu0c9ASFRVK6l-HIdH83xFbJOeI4/exec';

// ========== USER FUNCTIONS ==========

export async function sendMessage(user: string, message: string): Promise<any> {
  const url = `${SCRIPT_URL}?type=sendMessage&user=${encodeURIComponent(user)}&message=${encodeURIComponent(message)}`;
  const response = await fetch(url);
  return response.json();
}

export async function getMessages(user: string): Promise<any> {
  const url = `${SCRIPT_URL}?type=getMessages&user=${encodeURIComponent(user)}`;
  const response = await fetch(url);
  return response.json();
}

export async function markRead(user: string): Promise<any> {
  const url = `${SCRIPT_URL}?type=markRead&user=${encodeURIComponent(user)}`;
  const response = await fetch(url);
  return response.json();
}

// ========== ADMIN FUNCTIONS ==========

export async function adminReply(user: string, reply: string): Promise<any> {
  const url = `${SCRIPT_URL}?type=adminReply&user=${encodeURIComponent(user)}&reply=${encodeURIComponent(reply)}`;
  const response = await fetch(url);
  return response.json();
}

export async function getAllUsers(): Promise<any> {
  const url = `${SCRIPT_URL}?type=getAllUsers`;
  const response = await fetch(url);
  return response.json();
}
