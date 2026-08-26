import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, clearStoredUser, getDashboardRoute } from '../utils/auth';

export default function GuestGuard({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const navigate = useNavigate();

  if (user) {
    function handleLogout() {
      clearStoredUser();
      setUser(null);
      navigate(0);
    }

    return (
      <main className="split-screen" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="already-logged-alert" style={{ textAlign: 'center', padding: '30px', background: '#23232b', borderRadius: '12px', color: '#fff', maxWidth: '400px', width: '90%' }}>
          <div className="alert-content">
            <h3 style={{ marginBottom: '12px', color: '#3E8EFF' }}>Você já está logado!</h3>
            <p style={{ marginBottom: '20px' }}>
              Logado como: <strong>{user.nome}</strong> ({user.tipoUsuario})
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                id="logoutBtn"
                className="btn btn-secondary"
                onClick={handleLogout}
                style={{ padding: '8px 16px', borderRadius: '8px' }}
              >
                Fazer logout
              </button>
              <Link
                to={getDashboardRoute(user.tipoUsuario)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}
              >
                Ir para Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
