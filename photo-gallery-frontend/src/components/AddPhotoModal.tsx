import { useState } from 'react';
import api from '../services/api';

interface AddPhotoModalProps {
  albumId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPhotoModal({
  albumId,
  onClose,
  onSuccess,
}: AddPhotoModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dominantColor, setDominantColor] = useState('#000000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!albumId) {
      setError('Álbum inválido');
      return;
    }

    if (!file) {
      setError('Selecione uma imagem');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim() || file.name);
    formData.append('description', description.trim());
    formData.append('dominantColor', dominantColor);
    formData.append('acquiredAt', new Date().toISOString());

    try {
      setLoading(true);

      // NÃO definir Content-Type manualmente
      await api.post(`/albums/${albumId}/photos`, formData);

      onSuccess();
      onClose();
    } catch {
      setError('Erro ao enviar foto');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Adicionar Foto</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />

          <input
            placeholder="Título da foto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>
            Cor predominante:
            <input
              type="color"
              value={dominantColor}
              onChange={(e) => setDominantColor(e.target.value)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
