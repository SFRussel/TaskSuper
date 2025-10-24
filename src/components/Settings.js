// src/components/Settings.js
// Settings modal for profile customization
import { useState } from 'react';
import { X, User, Image, Mail, Bell, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadProfilePicture, uploadBackgroundImage, updateUserProfile } from '../services/authService';

const Settings = ({ isOpen, onClose }) => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileUrl, setProfileUrl] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleProfilePictureUpdate = async () => {
    if (!profileUrl.trim()) {
      setMessage('Please enter a valid image URL');
      return;
    }

    setLoading(true);
    setMessage('');
    const result = await uploadProfilePicture(currentUser.uid, profileUrl);
    if (result.success) {
      await refreshUserData();
      setMessage('Profile picture updated!');
      setProfileUrl('');
    } else {
      setMessage('Error: ' + result.error);
    }
    setLoading(false);
  };

  const handleBackgroundUpdate = async () => {
    if (!backgroundUrl.trim()) {
      setMessage('Please enter a valid image URL');
      return;
    }

    setLoading(true);
    setMessage('');
    const result = await uploadBackgroundImage(currentUser.uid, backgroundUrl);
    if (result.success) {
      await refreshUserData();
      setMessage('Background updated!');
      setBackgroundUrl('');
    } else {
      setMessage('Error: ' + result.error);
    }
    setLoading(false);
  };

  const handleNotificationToggle = async (type) => {
    const newValue = !userData.notifications[type];
    await updateUserProfile(currentUser.uid, {
      [`notifications.${type}`]: newValue
    });
    await refreshUserData();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="icon-button">
            <X size={20} />
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Image size={18} />
            Appearance
          </button>
          <button
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notifications
          </button>
        </div>

        <div className="settings-content">
          {message && (
            <div className={`settings-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              
              <div className="profile-picture-section">
                <div className="profile-picture-preview">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Profile" />
                  ) : (
                    <div className="profile-placeholder">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="form-group">
                    <label>
                      <LinkIcon size={18} />
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                  <button 
                    onClick={handleProfilePictureUpdate} 
                    className="upload-button"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Photo'}
                  </button>
                  <p className="upload-hint">Use image hosting services like Imgur, Cloudinary, or any direct image URL</p>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <User size={18} />
                  Username
                </label>
                <input type="text" value={userData?.username || ''} readOnly />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                <input type="email" value={userData?.email || ''} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Customize Appearance</h3>
              
              <div className="background-preview">
                {userData?.backgroundImage ? (
                  <img src={userData.backgroundImage} alt="Background" />
                ) : (
                  <div className="background-placeholder">
                    <Image size={40} />
                    <p>No background image</p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <LinkIcon size={18} />
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={backgroundUrl}
                  onChange={(e) => setBackgroundUrl(e.target.value)}
                  placeholder="https://example.com/background.jpg"
                />
              </div>

              <button 
                onClick={handleBackgroundUpdate} 
                className="upload-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Background'}
              </button>
              <p className="upload-hint">Recommended: 1920x1080px. Use services like Unsplash or Imgur</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              
              <div className="notification-toggle">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4>Email Notifications</h4>
                    <span className="coming-soon-badge">Coming Soon</span>
                  </div>
                  <p>Receive email updates about your tasks</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={userData?.notifications?.email || false}
                    onChange={() => handleNotificationToggle('email')}
                    disabled
                  />
                  <span className="toggle-slider disabled"></span>
                </label>
              </div>

              <div className="notification-toggle">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4>Deadline Reminders</h4>
                    <span className="coming-soon-badge">Coming Soon</span>
                  </div>
                  <p>Get notified when tasks are due soon</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={userData?.notifications?.deadline || false}
                    onChange={() => handleNotificationToggle('deadline')}
                    disabled
                  />
                  <span className="toggle-slider disabled"></span>
                </label>
              </div>

              <div className="notification-info">
                <p>📧 Email notifications and deadline reminders are currently in development and will be available in a future update!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
