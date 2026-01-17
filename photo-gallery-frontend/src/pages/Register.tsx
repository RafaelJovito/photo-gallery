import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await register(name, email, password);
      navigate('/albums');
    } catch {
      setError('Erro ao realizar cadastro');
    }
  }

  return (
    <div style={styles.container}>
      <h1>Meus álbuns de fotos</h1>
      <h2>Faça seu cadastro</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Cadastrar</button>
      </form>

      <div style={styles.links}>
        <Link to="/">Entrar</Link>
        <button style={styles.cancel} onClick={() => navigate('/')}>
          Cancelar
        </button>
      </div>
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
  links: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
  },
  cancel: {
    background: 'transparent',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
  },
};
