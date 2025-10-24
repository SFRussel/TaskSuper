// src/components/Header.js
// Header with user profile and navigation
import { useState } from 'react';
import { LogOut, Settings, User, Bell } from 'lucide-react';
import { logoutUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onOpenSettings }) => {
  const { userData } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <div className="logo-icon sticky-note">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="thunder-icon">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor"/>
            </svg>
          </div>
          <h1>TaskSuper</h1>
        </div>

        <div className="header-actions">
          <button className="icon-button notification-button">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  <User size={20} />
                </div>
              )}
              <span className="user-name">{userData?.username || 'User'}</span>
            </button>

            {showMenu && (
              <div className="user-dropdown">
                <button onClick={onOpenSettings} className="dropdown-item">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
