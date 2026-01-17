import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Albums from './pages/Albums';
import AlbumPhotos from './pages/AlbumPhotos';
import NewAlbum from './pages/NewAlbum';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* privadas */}
        <Route
          path="/albums"
          element={
            <PrivateRoute>
              <Albums />
            </PrivateRoute>
          }
        />

        {/* criação de álbum */}
        <Route
          path="/albums/new"
          element={
            <PrivateRoute>
              <NewAlbum />
            </PrivateRoute>
          }
        />

        {/* visualização do álbum */}
        <Route
          path="/albums/:id"
          element={
            <PrivateRoute>
              <AlbumPhotos />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
