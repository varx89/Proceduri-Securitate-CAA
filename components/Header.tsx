'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated by looking for auth-token cookie
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasAuthToken = cookies.some(cookie => 
        cookie.trim().startsWith('auth-token=')
      );
      setIsAuthenticated(hasAuthToken);
    };
    
    // Initial check
    checkAuth();
    
    // Set up interval to check auth status regularly
    const intervalId = setInterval(checkAuth, 1000);
    
    // Listen for storage events to detect login/logout
    window.addEventListener('storage', checkAuth);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <i className="bi bi-house-door-fill fst-normal">&nbsp; Acasa</i>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/#procedures">
                Proceduri
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/#procedures">
                Politici
              </Link>
            </li>
            <li className="nav-item">
              {isAuthenticated ? (
                <Link className="nav-link" href="/dashboard">
                  Contul meu
                </Link>
              ) : (
                <Link className="nav-link" href="/login">
                  Contul meu
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}