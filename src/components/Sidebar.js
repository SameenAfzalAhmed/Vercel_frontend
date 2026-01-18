import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Plus } from 'lucide-react';

const Sidebar = ({ onCreatePlaylist }) => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' }
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col" data-testid="sidebar">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-glow" data-testid="app-logo">E1 Music</h1>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`
            }
            data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="border-t border-border my-4" />

        <button
          onClick={onCreatePlaylist}
          className="flex items-center gap-3 px-3 py-3 rounded-md mb-1 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors w-full"
          data-testid="create-playlist-button"
        >
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </nav>

      <div className="p-4 text-xs text-muted-foreground">
        <p>&copy; 2025 E1 Music</p>
      </div>
    </div>
  );
};

export default Sidebar;