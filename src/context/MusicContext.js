import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlists, setPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const audioRef = useRef(new Audio());

  // Load songs
  const loadSongs = async (search = '') => {
    try {
      const response = await axios.get(`${API}/songs`, {
        params: search ? { search } : {}
      });
      setSongs(response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading songs:', error);
      return [];
    }
  };

  // Load playlists
  const loadPlaylists = async () => {
    try {
      const response = await axios.get(`${API}/playlists`);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  // Load favorites
  const loadFavorites = async () => {
    try {
      const response = await axios.get(`${API}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Play song
  const playSong = (song, songQueue = []) => {
    if (song) {
      setCurrentSong(song);
      audioRef.current.src = song.audio_url;
      audioRef.current.play();
      setIsPlaying(true);
      
      if (songQueue.length > 0) {
        setQueue(songQueue);
        const index = songQueue.findIndex(s => s.id === song.id);
        setCurrentIndex(index !== -1 ? index : 0);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Next song
  const nextSong = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playSong(queue[nextIndex], queue);
    }
  };

  // Previous song
  const previousSong = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playSong(queue[prevIndex], queue);
    }
  };

  // Seek to time
  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Change volume
  const changeVolume = (newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Add to favorites
  const addToFavorites = async (songId) => {
    try {
      await axios.post(`${API}/favorites`, { song_id: songId });
      await loadFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (songId) => {
    try {
      await axios.delete(`${API}/favorites/${songId}`);
      await loadFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  // Check if song is favorited
  const isFavorite = (songId) => {
    return favorites.some(fav => fav.song_id === songId);
  };

  // Create playlist
  const createPlaylist = async (name, description, coverUrl) => {
    try {
      const response = await axios.post(`${API}/playlists`, {
        name,
        description,
        cover_url: coverUrl
      });
      await loadPlaylists();
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  };

  // Add song to playlist
  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      await axios.post(`${API}/playlists/${playlistId}/songs`, {
        song_id: songId
      });
      await loadPlaylists();
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      throw error;
    }
  };

  // Remove song from playlist
  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      await axios.delete(`${API}/playlists/${playlistId}/songs/${songId}`);
      await loadPlaylists();
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  // Delete playlist
  const deletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`${API}/playlists/${playlistId}`);
      await loadPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  // Get songs for playlist
  const getPlaylistSongs = async (playlistId) => {
    try {
      const playlist = await axios.get(`${API}/playlists/${playlistId}`);
      const songPromises = playlist.data.song_ids.map(id => 
        axios.get(`${API}/songs/${id}`)
      );
      const songResponses = await Promise.all(songPromises);
      return songResponses.map(r => r.data);
    } catch (error) {
      console.error('Error loading playlist songs:', error);
      return [];
    }
  };

  // Initialize sample data
  const initData = async () => {
    try {
      await axios.post(`${API}/init-data`);
      await loadSongs();
      await loadPlaylists();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      nextSong();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, queue]);

  // Set initial volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, []);

  const value = {
    songs,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playlists,
    favorites,
    queue,
    loadSongs,
    loadPlaylists,
    loadFavorites,
    playSong,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    changeVolume,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    getPlaylistSongs,
    initData
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};