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

const API = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

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
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function loginUser(payload: LoginPayload) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchItems() {
  const res = await fetch(`${API}/items`, { method: "GET" });
  return handleResponse(res);
}
