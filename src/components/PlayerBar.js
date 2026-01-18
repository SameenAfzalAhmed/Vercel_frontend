import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Share2 } from 'lucide-react';

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    changeVolume
  } = useMusic();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seekTo(percentage * duration);
  };

  const handleShare = () => {
    if (currentSong && navigator.share) {
      navigator.share({
        title: currentSong.title,
        text: `Check out ${currentSong.title} by ${currentSong.artist}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else if (currentSong) {
      const shareText = `Check out ${currentSong.title} by ${currentSong.artist}`;
      navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    }
  };

  if (!currentSong) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-t border-white/10 player-bar-glow"
      data-testid="player-bar"
    >
      {/* Progress bar */}
      <div 
        className="w-full h-1 bg-muted cursor-pointer progress-bar group hover:h-1.5"
        onClick={handleProgressClick}
        data-testid="progress-bar"
      >
        <div 
          className="h-full bg-primary transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0" data-testid="current-song-info">
            <img 
              src={currentSong.cover_url} 
              alt={currentSong.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{currentSong.title}</div>
              <div className="text-xs text-muted-foreground truncate">{currentSong.artist}</div>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={previousSong}
                className="control-button p-2 hover:bg-white/10 rounded-full"
                data-testid="previous-button"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="control-button bg-primary text-primary-foreground p-3 rounded-full hover:scale-105"
                data-testid="play-pause-button"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={nextSong}
                className="control-button p-2 hover:bg-white/10 rounded-full"
                data-testid="next-button"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-white/10 rounded-full control-button"
              data-testid="share-button"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeVolume(volume > 0 ? 0 : 0.7)}
                className="p-2 hover:bg-white/10 rounded-full control-button"
                data-testid="volume-toggle"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer volume-slider"
                data-testid="volume-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;