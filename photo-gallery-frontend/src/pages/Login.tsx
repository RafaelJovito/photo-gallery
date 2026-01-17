import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/albums');
    } catch {
      setError('E-mail ou senha inválidos');
    }
  }

  return (
    <div style={styles.container}>
      <h1>Meus álbuns de fotos</h1>
      <h2>Autentique-se</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit">Entrar</button>
      </form>

      <p>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '60px auto',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  error: {
    color: 'red',
  },
};
