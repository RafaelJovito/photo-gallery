import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function NewAlbum() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/albums', {
        title,
        description,
      });

      navigate(`/albums/${response.data.id}`);
    } catch {
      setError('Erro ao criar álbum');
    }
  }

  return (
    <div className="page-albums">
      <div className="container">
        <h1>Criar novo álbum</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Título do álbum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button className="button-primary" type="submit">
            Criar álbum
          </button>
        </form>
      </div>
    </div>
  );
}
