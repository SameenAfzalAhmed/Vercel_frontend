import React, { useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';
import { Heart, Music, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";


const Library = () => {
  const {
    playlists,
    favorites,
    songs,
    loadPlaylists,
    loadFavorites,
    loadSongs,
    createPlaylist,
    deletePlaylist
  } = useMusic();
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPlaylists();
    loadFavorites();
    loadSongs();
  }, []);

  useEffect(() => {
    if (favorites.length > 0 && songs.length > 0) {
      const favSongs = favorites
        .map(fav => songs.find(song => song.id === fav.song_id))
        .filter(Boolean);
      setFavoriteSongs(favSongs);
    }
  }, [favorites, songs]);

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        await createPlaylist(
          newPlaylistName,
          newPlaylistDesc,
          'https://images.unsplash.com/photo-1764936510087-e113d6da4af9?crop=entropy&cs=srgb&fm=jpg&q=85'
        );
        setShowCreateModal(false);
        setNewPlaylistName('');
        setNewPlaylistDesc('');
      } catch (error) {
        console.error('Error creating playlist:', error);
      }
    }
  };

  const handleDeletePlaylist = async (e, playlistId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist(playlistId);
    }
  };

  return (
    <div className="space-y-8" data-testid="library-page">
      
      {/* SEO */}
      <Helmet>
        <title>Your Music Library – Saved Songs & Playlists | S1 Pulse</title>
        <meta
          name="description"
          content="Access your saved songs and playlists in your personal music library on S1 Pulse."
        />
      </Helmet>

      <h1 className="mt-6 sm:mt-8 md:mt-0 text-4xl font-bold" data-testid="library-title">Your Library</h1>

      {/* Favorites Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <h2 className="text-2xl font-bold" data-testid="favorites-title">Liked Songs</h2>
          <span className="text-sm text-muted-foreground">({favoriteSongs.length})</span>
        </div>

        {favoriteSongs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoriteSongs.map(song => (
              <SongCard key={song.id} song={song} queue={favoriteSongs} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No liked songs yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Start liking songs to see them here</p>
          </div>
        )}
      </section>

      {/* Playlists Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold" data-testid="playlists-title">Playlists</h2>
            <span className="text-sm text-muted-foreground">({playlists.length})</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full hover:scale-105 transition-transform font-semibold md:px-4 md:py-2 md:text-sm   px-3 py-1 text-xs    "
            data-testid="create-new-playlist-button"
          >
            <Plus className="w-4 h-4 hidden sm:inline" />
            Create Playlist
          </button>
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playlists.map(playlist => (
              <div
                key={playlist.id}
                className="group relative rounded-md overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all album-card-hover cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                data-testid={`library-playlist-${playlist.id}`}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={playlist.cover_url}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                    className="absolute top-2 right-2 p-2 bg-destructive/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    data-testid={`delete-playlist-${playlist.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate mb-1">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {playlist.song_ids.length} song{playlist.song_ids.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Music className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No playlists yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Create your first playlist</p>
          </div>
        )}
      </section>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
          data-testid="create-playlist-modal"
        >
          <div
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Create New Playlist</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-md px-4 py-2 outline-none transition-colors"
                  data-testid="playlist-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-md px-4 py-2 outline-none transition-colors resize-none"
                  data-testid="playlist-description-input"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
                  data-testid="cancel-create-playlist"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:scale-105 transition-transform font-semibold"
                  data-testid="confirm-create-playlist"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;