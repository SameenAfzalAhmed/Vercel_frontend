import React, { useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';
import { Sparkles } from 'lucide-react';
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { songs, loadSongs, playlists, loadPlaylists, initData } = useMusic();

  useEffect(() => {
    const init = async () => {
      await initData();
      await loadSongs();
      await loadPlaylists();
    };
    init();
  }, []);

  return (
    
    <div className="mt-6 sm:mt-8 md:mt-0 space-y-8" data-testid="home-page">
      {/*SEO */}
      <Helmet>
        <title>Free Online Music Player & Playlists | S1 Pulse</title>
        <meta
          name="description"
          content="Stream music online for free, discover new tracks, and create playlists on S1 Pulse music player."
        />
      </Helmet>
      {/* Hero Section */}
      <div 
        className="relative rounded-lg overflow-hidden p-12"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 148, 0.15) 0%, transparent 70%)'
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-glow" data-testid="home-hero-title">
            Discover Your Sound 
            
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl">
            Immerse yourself in a world of music. Stream your favorite tracks and discover new ones.
          </p>
        </div>
      </div>

      {/* Popular Tracks */}
      <section>
        <h2 className="text-2xl font-bold mb-6" data-testid="popular-tracks-title">Popular Tracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {songs.slice(0, 10).map(song => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      </section>

      {/* Playlists */}
      {playlists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" data-testid="playlists-section-title">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playlists.map(playlist => (
              <div 
                key={playlist.id}
                className="group relative rounded-md overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all album-card-hover cursor-pointer"
                data-testid={`playlist-card-${playlist.id}`}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={playlist.cover_url} 
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate mb-1">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{playlist.song_ids.length} songs</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;