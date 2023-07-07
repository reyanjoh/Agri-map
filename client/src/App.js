import React, { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{
    if (localStorage.getItem('userName')) {
      setIsAuthenticated(true);
    }
  },[])

  const handleLogin = () => {
      setIsAuthenticated(true);
    // Perform login logic, e.g., validate credentials, set authentication state
  };

  const handleLogout = () => {
    // Perform logout logic, e.g., clear tokens, reset authentication state
    setIsAuthenticated(false);
  };

  return (
    <div className="app">
      {isAuthenticated ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
