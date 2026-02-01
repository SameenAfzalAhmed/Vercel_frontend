import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Plus } from 'lucide-react';

const Sidebar = ({ onCreatePlaylist, closeSidebar, className }) => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const handleClick = (callback) => {
    if (callback) callback();
    if (closeSidebar) closeSidebar();
  };

  return (
    <div className={`${className} flex flex-col`} data-testid="sidebar">
      <div className="flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <circle cx="100" cy="100" r="50" fill="#000000" />
          <circle
            cx="100"
            cy="100"
            r="48"
            fill="none"
            stroke="#00FF88"
            strokeWidth="1.5"
            filter="url(#neon-glow)"
            opacity="0.8"
          />
          <text
            x="100"
            y="85"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="800"
            fontSize="14"
            fill="#FFFFFF"
          >
            S1 Pulse
          </text>
          <g fill="#00FF88" filter="url(#neon-glow)">
            <rect x="82" y="105" width="4" height="10" rx="1" />
            <rect x="89" y="100" width="4" height="15" rx="1" />
            <rect x="96" y="95" width="4" height="20" rx="1" />
            <rect x="103" y="102" width="4" height="13" rx="1" />
            <rect x="110" y="98" width="4" height="17" rx="1" />
            <rect x="117" y="107" width="4" height="8" rx="1" />
          </g>
          <path d="M97 125 L106 130 L97 135 Z" fill="#FFFFFF" />
        </svg>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => handleClick()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-md mb-1 transition-colors ${isActive
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
          onClick={() => handleClick(onCreatePlaylist)}
          className="flex items-center gap-3 px-3 py-3 rounded-md mb-1 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors w-full"
          data-testid="create-playlist-button"
        >
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </nav>

      <div className="p-4 text-xs text-muted-foreground">
        <p>&copy; 2026 S1 Music</p>
      </div>
    </div>
  );
};

export default Sidebar;
