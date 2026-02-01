import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, onCreatePlaylist }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Optional: Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden" data-testid="app-layout">

      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-0 left-4 z-50 bg-black/70 p-2 rounded text-white"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div ref={sidebarRef}>
        <Sidebar
          onCreatePlaylist={onCreatePlaylist}
          closeSidebar={() => setSidebarOpen(false)}
          className={`fixed md:static z-40 w-64 h-full bg-card border-r border-border transform transition-transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-10 overflow-y-auto pb-32">
        <div className="container mx-auto px-4 md:px-8 py-6">
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
        <Toaster position="top-right" reverseOrder={false} />
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
