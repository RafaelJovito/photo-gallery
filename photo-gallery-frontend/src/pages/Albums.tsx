import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { logout, getUser } from '../services/auth';

interface Album {
  id: string;
  title: string;
  description?: string;
  photos?: { fileUrl: string }[];
}

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  const user = getUser();

  useEffect(() => {
    async function loadAlbums() {
      try {
        const response = await api.get<Album[]>('/albums');
        setAlbums(response.data);
      } catch {
        setAlbums([]);
      }
    }

    loadAlbums();
  }, [user?.name]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="page-albums">
      <div className="container">
        <header className="albums-header">
          <h1>Meus álbuns de fotos</h1>
          <div>
            Olá, <strong>{user?.name ?? 'Usuário'}</strong>{' '}
            <button className="link" onClick={handleLogout}>
              [sair]
            </button>
          </div>
        </header>

        <section className="albums-grid">
          {albums.map((album) => (
            <div
              key={album.id}
              className="album-card"
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              <div className="album-thumb" />
              <h3>{album.title}</h3>
              <p>{album.description}</p>
            </div>
          ))}
        </section>
      </div>

      <button
        className="button-primary floating-button"
        onClick={() => navigate('/albums/new')}
      >
        Criar novo álbum
      </button>
    </div>
  );

}
