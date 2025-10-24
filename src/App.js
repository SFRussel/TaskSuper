// src/App.js
// Main application component
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './pages/Auth';
import Board from './pages/Board';

const AppContent = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Auth />;
  }

  return <Board />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
