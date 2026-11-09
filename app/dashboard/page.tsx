'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUpload from '../../components/FileUpload';
import ProcedureList from '../../components/ProcedureList';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="container py-2 d-flex justify-content-end">
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          Deconectare
        </button>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Gestionare Proceduri</h1>
            
            {/* File Upload Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Încărcare Fișiere PDF</h5>
              </div>
              <div className="card-body">
                <FileUpload />
              </div>
            </div>

            {/* Procedures List */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Proceduri și Politici</h5>
              </div>
              <div className="card-body">
                <ProcedureList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
