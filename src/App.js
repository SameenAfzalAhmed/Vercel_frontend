import React, { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';

const Layout = ({ children, onCreatePlaylist }) => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen overflow-hidden" data-testid="app-layout">
      <Sidebar onCreatePlaylist={onCreatePlaylist} />
      <main className="flex-1 ml-64 overflow-y-auto pb-32">
        <div className="container mx-auto px-8 py-8">
          {children}
        </div>
      </main>
      <PlayerBar />
    </div>
  );
};

function App() {
  const [shouldNavigateToLibrary, setShouldNavigateToLibrary] = useState(false);

  const handleCreatePlaylist = () => {
    setShouldNavigateToLibrary(true);
    window.location.href = '/library';
  };

  return (
    <div className="App">
      <MusicProvider>
        <BrowserRouter>
          <Layout onCreatePlaylist={handleCreatePlaylist}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MusicProvider>
    </div>
  );
}

export default App;