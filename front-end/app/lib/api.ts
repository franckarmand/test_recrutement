type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const API = (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:4000";
console.log('[API] base url=', API);

function timeoutFetch(url: string, init: RequestInit = {}, ms = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  const finalInit = { ...init, signal: controller.signal };
  return fetch(url, finalInit).finally(() => clearTimeout(id));
}

async function handleResponse(res: Response) {
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(json?.message || text || res.statusText);
    return json;
  } catch (err) {
    if (!res.ok) throw new Error(text || res.statusText);
    // if JSON parse failed but status ok, return raw text
    return text;
  }
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const res = await timeoutFetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while registering');
  }
}

export async function loginUser(payload: LoginPayload) {
  try {
    const res = await timeoutFetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while logging in');
  }
}

export async function fetchItems() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}/items`, { method: "GET", headers });
  return handleResponse(res);
}

export async function fetchArticles() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await timeoutFetch(`${API}/articles`, {
      method: "GET",
      headers,
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while fetching articles');
  }
}

export async function deleteArticle(id: number) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await timeoutFetch(`${API}/articles/${id}`, {
      method: "DELETE",
      headers,
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while deleting article');
  }
}

export async function getArticle(id: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await timeoutFetch(`${API}/articles/${id}`, {
      method: "GET",
      headers,
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while fetching article');
  }
}

export async function createArticle(data: { title: string; content: string }) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await timeoutFetch(`${API}/articles`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while creating article');
  }
}

export async function updateArticle(id: string, data: { title: string; content: string }) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await timeoutFetch(`${API}/articles/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }, 10000);
    return await handleResponse(res as Response);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (10s)');
    throw new Error(err.message || 'Network error while updating article');
  }
}
