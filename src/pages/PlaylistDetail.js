import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import SongRow from '../components/SongRow';
import { Play, ArrowLeft, Share2 } from 'lucide-react';
import { Helmet } from "react-helmet-async";

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const {
    playlists,
    loadPlaylists,
    getPlaylistSongs,
    playSong,
    removeSongFromPlaylist
  } = useMusic();

  const [playlist, setPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    await loadPlaylists();
    const foundPlaylist = playlists.find(p => p.id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      const songs = await getPlaylistSongs(id);
      setPlaylistSongs(songs);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (playlists.length > 0 && !playlist) {
      const foundPlaylist = playlists.find(p => p.id === id);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
        getPlaylistSongs(id).then(setPlaylistSongs);
      }
    }
  }, [playlists, id]);

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const handleRemoveSong = async (songId) => {
    await removeSongFromPlaylist(id, songId);
    await loadData();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist?.name,
        text: `Check out ${playlist?.name} playlist`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground" data-testid="playlist-loading">
        Loading...
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-12" data-testid="playlist-not-found">
        <p className="text-muted-foreground">Playlist not found</p>
        <button
          onClick={() => navigate('/library')}
          className="mt-4 text-primary hover:underline"
        >
          Go back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="playlist-detail-page">
        {/* Back button */}
      <Helmet>
        <title>{playlist?.name} Playlist – Stream Music | S1 Pulse</title>
        <meta
          name="description"
          content={`Listen to ${playlist?.song_ids.length} songs in the ${playlist?.name} playlist on S1 Pulse.`}
        />
      </Helmet>


      {/* Back button */}
      <button
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-library-button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      {/* Playlist Header */}
      <div className="flex gap-6 items-end">
        <img
          src={playlist.cover_url}
          alt={playlist.name}
          className="w-48 h-48 rounded-lg shadow-lg object-cover"
        />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Playlist</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-4 break-words" data-testid="playlist-name">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground mb-4">{playlist.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {playlistSongs.length} song{playlistSongs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={playlistSongs.length === 0}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:scale-105 transition-transform font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="play-all-button"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          Play All
        </button>
        <button
          onClick={handleShare}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          data-testid="share-playlist-button"
          title="Share Playlist"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Songs List */}
      {playlistSongs.length > 0 ? (
        <div className="space-y-1">
          <div className="grid grid-cols-[40px_1fr_1fr_80px_50px] gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
            <div className="text-center">#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="text-center">Duration</div>
            <div></div>
          </div>
          {playlistSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              queue={playlistSongs}
              showRemove
              onRemove={handleRemoveSong}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">This playlist is empty</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add songs to get started</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;