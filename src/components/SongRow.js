import React from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const SongRow = ({ song, index, queue = [], onAddToPlaylist, showRemove, onRemove }) => {
  const { playSong, addToFavorites, removeFromFavorites, isFavorite, currentSong, isPlaying } = useMusic();
  const favorited = isFavorite(song.id);
  const isCurrentSong = currentSong?.id === song.id;

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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`grid grid-cols-[40px_1fr_1fr_80px_50px] gap-4 items-center px-4 py-2 rounded song-row-hover cursor-pointer ${
        isCurrentSong ? 'bg-primary/10' : ''
      }`}
      onClick={handlePlay}
      data-testid={`song-row-${song.id}`}
    >
      <div className="text-center">
        {isCurrentSong && isPlaying ? (
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">{index + 1}</span>
        )}
      </div>
      
      <div className="flex items-center gap-3 min-w-0">
        <img 
          src={song.cover_url} 
          alt={song.title}
          className="w-10 h-10 rounded object-cover"
        />
        <div className="min-w-0">
          <div className={`font-medium text-sm truncate ${
            isCurrentSong ? 'text-primary' : ''
          }`}>{song.title}</div>
          <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground truncate:sm text-sm">{song.album}</div>
      
      <div className="text-sm text-muted-foreground font-mono text-center">
        {formatDuration(song.duration)}
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleFavorite}
          className="p-1 hover:scale-110 transition-transform"
          data-testid={`favorite-row-button-${song.id}`}
        >
          <Heart 
            className={`w-4 h-4 ${favorited ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
          />
        </button>
        
        {showRemove && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(song.id);
            }}
            className="p-1 hover:text-destructive transition-colors"
            data-testid={`remove-song-${song.id}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SongRow;