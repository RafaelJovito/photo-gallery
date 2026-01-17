import api from '../services/api';

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const TOKEN_KEY = '@gallery:token';
const USER_KEY = '@gallery:user';

// 🔐 LOGIN
export async function login(email: string, password: string): Promise<void> {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });

  console.log('LOGIN RESPONSE 👉', response.data);

  localStorage.setItem(TOKEN_KEY, response.data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
}

// 📝 REGISTER
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<void> {
    console.log('REGISTER PAYLOAD 👉', { name, email, password });
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  });

  localStorage.setItem('@gallery:token', response.data.access_token);
  localStorage.setItem('@gallery:user', JSON.stringify(response.data.user));
}

// 🔓 LOGOUT
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// 👤 USUÁRIO LOGADO
export function getUser(): { name: string } | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}
