const SCRIPT_URL = '/api/chat';

async function postToScript(body: object): Promise<any> {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function sendMessage(user: string, message: string): Promise<any> {
  return postToScript({ type: 'sendMessage', user, message });
}

export async function getMessages(user: string): Promise<any> {
  return postToScript({ type: 'getMessages', user });
}

export async function markRead(user: string): Promise<any> {
  return postToScript({ type: 'markRead', user });
}

export async function adminReply(user: string, reply: string): Promise<any> {
  return postToScript({ type: 'adminReply', user, reply });
}

export async function getAllUsers(): Promise<any> {
  return postToScript({ type: 'getAllUsers' });
}
