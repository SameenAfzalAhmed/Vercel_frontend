import React, { useState } from 'react';
import { Play, Heart, Plus ,X} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import toast from 'react-hot-toast';




const SongCard = ({ song, queue = [] }) => {
  const { playSong, addToFavorites, removeFromFavorites, isFavorite, playlistId, playlists, addSongToPlaylist } = useMusic();
  const favorited = isFavorite(song.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');


  const handlePlay = () => {
    playSong(song, queue.length > 0 ? queue : [song]);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      if (favorited) {
        await removeFromFavorites(song.id);
      } else {
        await addToFavorites(song.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToPlaylist = async (e) => {
    if (!selectedPlaylistId) {
      toast.error("No playlist selected to add song");
      return;
    }
    try {
      await addSongToPlaylist(selectedPlaylistId, song.id);
      toast.success(`Song ${song.title} added to playlist successfully`);
      setModalOpen(false);
    } catch (error) {
      toast.error("Error adding song to playlist:", error.response?.data || error);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="group relative rounded-md overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all album-card-hover cursor-pointer"
      onClick={handlePlay}
      data-testid={`song-card-${song.id}`}
    >
      <div className="aspect-square relative overflow-hidden:sm overflow-visible">
        <img
          src={song.cover_url}
          alt={song.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            className="bg-primary text-primary-foreground p-4 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
            data-testid={`play-song-${song.id}`}
          >
            <Play className="w-6 h-6" fill="currentColor" />
          </button>
        </div>



        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          data-testid={`favorite-button-${song.id}`}
        >
          <Heart
            className={`w-4 h-4 ${favorited ? 'fill-primary text-primary' : 'text-white'}`}
          />
        </button>



        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="absolute top-2 right-10 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <Plus className="w-4 h-4" />
        </button>

        {modalOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-12 right-0 bg-card border border-border rounded-md shadow-lg p-4 z-50 w-48:w-30 sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold">Add to Playlist</h4>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <select
              className="w-full border border-border rounded-md p-1 mb-2 text-black"
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
            >
              <option value="">Select a playlist</option>
              {playlists?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              className="bg-primary text-primary-foreground w-full p-2 rounded-md hover:bg-primary/80"
              onClick={handleAddToPlaylist}
            >
              Add
            </button>
          </div>
        )}

      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm truncate mb-1">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        <p className="text-xs text-muted-foreground/70 mt-1 font-mono">{formatDuration(song.duration)}</p>
      </div>
    </div>
  );
};

export default SongCard;