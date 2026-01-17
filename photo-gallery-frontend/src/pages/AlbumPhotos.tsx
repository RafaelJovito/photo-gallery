import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddPhotoModal from '../components/AddPhotoModal';
import api from '../services/api';
import { logout, getUser } from '../services/auth';

interface Photo {
  id: string;
  title: string;
  size: number;
  acquiredAt?: string;
  dominantColor?: string;
  fileUrl: string;
}

interface Album {
  id: string;
  title: string;
  description?: string;
}

export default function AlbumPhotos() {
  const { id: albumId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getUser();

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔄 Buscar fotos
  const fetchPhotos = useCallback(async () => {
    if (!albumId) return;

    const response = await api.get<Photo[]>(`/albums/${albumId}/photos`);
    setPhotos(response.data);
  }, [albumId]);

  // 🔄 Buscar álbum + fotos
  useEffect(() => {
    if (!albumId) {
      setError('Álbum inválido');
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const albumRes = await api.get<Album>(`/albums/${albumId}`);
        setAlbum(albumRes.data);
        await fetchPhotos();
      } catch {
        setError('Erro ao carregar álbum');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [albumId, fetchPhotos]);

  // 🗑 Excluir foto
  async function handleDeletePhoto(photoId: string) {
    if (!confirm('Excluir esta foto?')) return;

    try {
      await api.delete(`/albums/${albumId}/photos/${photoId}`);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch {
      alert('Erro ao excluir foto');
    }
  }

  // 🗑 Excluir álbum
  async function handleDeleteAlbum() {
    if (
      !confirm(
        'Deseja excluir este álbum? Só será possível se não houver fotos.',
      )
    )
      return;

    try {
      await api.delete(`/albums/${albumId}`);
      navigate('/albums');
    } catch {
      alert('Não é possível excluir um álbum com fotos');
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // ⏳ Estados de carregamento / erro
  if (loading) {
    return <p>Carregando álbum...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!album) {
    return <p>Álbum não encontrado</p>;
  }

  return (
    <div className="page-album">
      <div className="container">
        {/* HEADER */}
        <header className="album-header">
          <h1>Meus álbuns de fotos</h1>

          <div>
            Olá, <strong>{user?.name ?? 'Usuário'}</strong>{' '}
            <button className="link" onClick={handleLogout}>
              [sair]
            </button>
          </div>
        </header>

        {/* INFO DO ÁLBUM */}
        <section className="album-info">
          <div>
            <h2>{album.title}</h2>
            <p>{album.description}</p>
          </div>

          <div className="album-view">
            Visualizar como:{' '}
            <button
              className={viewMode === 'table' ? 'link active' : 'link'}
              onClick={() => setViewMode('table')}
            >
              Tabela
            </button>
            {' / '}
            <button
              className={viewMode === 'grid' ? 'link active' : 'link'}
              onClick={() => setViewMode('grid')}
            >
              Miniaturas
            </button>
          </div>
        </section>

        {/* TABELA */}
        {viewMode === 'table' && (
          <table className="album-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Tamanho</th>
                <th>Data de aquisição</th>
                <th>Cor predominante</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {photos.map((photo) => (
                <tr key={photo.id}>
                  <td>{photo.title}</td>
                  <td>{photo.size} bytes</td>
                  <td>
                    {photo.acquiredAt
                      ? new Date(photo.acquiredAt).toLocaleString()
                      : '-'}
                  </td>
                  <td>
                    {photo.dominantColor ? (
                      <span
                        className="color-box"
                        style={{ background: photo.dominantColor }}
                      >
                        {photo.dominantColor}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button
                      className="button-danger"
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* GRID */}
        {viewMode === 'grid' && (
          <div className="albums-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="album-card">
                <div className="album-thumb">
                  <img src={photo.fileUrl} alt={photo.title} />
                </div>
                <h3>{photo.title}</h3>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <footer className="album-actions">
          <button className="button-danger" onClick={handleDeleteAlbum}>
            Excluir álbum
          </button>

          <button
            className="button-secundery"
            onClick={() => navigate('/albums')}
          >
            ← Voltar
          </button>

          <button
            className="button-primary"
            onClick={() => setShowAddPhotoModal(true)}
          >
            Adicionar fotos
          </button>
        </footer>

        {/* MODAL */}
        {showAddPhotoModal && (
          <AddPhotoModal
            albumId={albumId!}
            onClose={() => setShowAddPhotoModal(false)}
            onSuccess={fetchPhotos}
          />
        )}
      </div>
    </div>
  );
}
