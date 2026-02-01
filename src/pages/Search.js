import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import SongRow from '../components/SongRow';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { loadSongs } = useMusic();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results = await loadSongs(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-6" data-testid="search-page">
      <div>
        <h1 className=" mt-6 sm:mt-8 md:mt-0 text-4xl font-bold mb-6" data-testid="search-page-title">Search</h1>
        
        {/* Search Input */}
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-transparent focus:border-primary rounded-full pl-12 pr-12 py-3 text-sm outline-none transition-colors"
            data-testid="search-input"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              data-testid="clear-search-button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isSearching ? (
        <div className="text-center py-12 text-muted-foreground" data-testid="search-loading">
          Searching...
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="search-results-title">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </h2>
          <div className="space-y-1">
            {searchResults.map((song, index) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={index}
                queue={searchResults}
              />
            ))}
          </div>
        </div>
      ) : searchQuery ? (
        <div className="text-center py-12 text-muted-foreground" data-testid="no-search-results">
          No results found for "{searchQuery}"
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Start typing to search for music</p>
        </div>
      )}
    </div>
  );
};

export default Search;