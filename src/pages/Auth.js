// src/pages/Auth.js
// Authentication page with login and register forms
import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      {showLogin ? (
        <Login onToggleForm={() => setShowLogin(false)} />
      ) : (
        <Register onToggleForm={() => setShowLogin(true)} />
      )}
    </div>
  );
};

export default Auth;
