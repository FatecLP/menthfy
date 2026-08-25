import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStoredUser, clearStoredUser, getDashboardRoute } from '../utils/auth';

export default function Header({ isHome = false }) {
  const [user, setUser] = useState(getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function handleLogout() {
    clearStoredUser();
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  }

  const isLoginPage = location.pathname === '/login';
  const isCadastroPage = location.pathname === '/cadastro';

  return (
    <header className={isHome ? 'home-header' : ''}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>menthfy</h1>
      </Link>
      <div className="header-1">
        <ul>
          <li id="li1">
            <Link to="/">Home</Link>
          </li>
          <li id="li2">
            <Link to="/catalogo">Catálogo</Link>
          </li>
          <li id="li3">
            <Link to="/contato">Contato</Link>
          </li>
        </ul>

        <div ref={menuRef}>
          {user ? (
            <div
              className="user-profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                position: 'relative',
              }}
            >
              <Link
                to={getDashboardRoute(user.tipoUsuario)}
                className="dashboard-link-btn header-action-btn header-action-btn-primary"
              >
                Dashboard
              </Link>
              <div
                className="user-right"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <div id="user-menu-trigger" className="user-avatar" title="Abrir menu de usuário">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#E5E7EB" />
                    <path
                      d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z"
                      fill="#9CA3AF"
                    />
                    <path
                      d="M20 22C14.4771 22 10 26.4771 10 32V34C10 35.1046 10.8954 36 12 36H28C29.1046 36 30 35.1046 30 34V32C30 26.4771 25.5229 22 20 22Z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>
                <h2 id="user-menu-name" style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 500 }}>
                  {user.nome}
                </h2>
              </div>

              <div className={`user-menu ${menuOpen ? 'user-menu-visible' : 'user-menu-hidden'}`} id="user-menu">
                <ul>
                  <li>
                    <button id="logout-btn" className="menu-action-btn" type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', alignItems: 'center' }}>
              {!isLoginPage && (
                <Link to="/login" className="login-btn header-action-btn header-action-btn-primary">
                  Login
                </Link>
              )}
              {!isCadastroPage && (
                <Link to="/cadastro" className="signup-btn header-action-btn header-action-btn-primary">
                  Cadastro
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
