import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { getStoredUser, clearStoredUser, getDashboardRoute } from '../utils/auth';

/**
 * Modern navigation header for Menthfy.
 * Responsive, brand-consistent, with authentication detection and mobile drawer.
 */
export default function Header() {
  const [user, setUser] = useState(getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    setUser(getStoredUser());
    setMobileDrawerOpen(false);
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

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="menthfy-header bg-[#5F688F] text-white border-b border-white/15 shadow-xs sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="md:flex-1 flex items-center justify-start">
          <Link to="/" className="flex items-center gap-2 group text-decoration-none shrink-0">
            <span className="font-['Baumans'] text-3xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              menthfy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 text-[15px] font-medium shrink-0">
          <Link
            to="/"
            className={`nav-link-item relative py-1 transition-colors text-decoration-none ${
              isCurrent('/') ? 'text-white font-bold active after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : 'text-white/80 hover:text-white'
            }`}
          >
            Início
          </Link>
          <Link
            to="/catalogo"
            className={`nav-link-item relative py-1 transition-colors text-decoration-none ${
              isCurrent('/catalogo') ? 'text-white font-bold active after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : 'text-white/80 hover:text-white'
            }`}
          >
            Catálogo
          </Link>
          <Link
            to="/contato"
            className={`nav-link-item relative py-1 transition-colors text-decoration-none ${
              isCurrent('/contato') ? 'text-white font-bold active after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : 'text-white/80 hover:text-white'
            }`}
          >
            Contato
          </Link>
        </nav>

        {/* Auth / Profile Actions */}
        <div className="hidden md:flex md:flex-1 items-center justify-end gap-3">
          {user ? (
            <div ref={menuRef} className="relative flex items-center gap-2">
              <Link
                to={getDashboardRoute(user.tipoUsuario)}
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white hover:bg-white/10 font-medium px-3 py-1.5 rounded-xl text-sm transition text-decoration-none"
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full text-white text-sm font-medium transition cursor-pointer border-0 ${
                  menuOpen ? 'bg-white/15' : 'bg-transparent hover:bg-white/10'
                }`}
              >
                <div className="size-7 rounded-full bg-white text-[#5F688F] flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                  {user.nome?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[120px] truncate text-white">{user.nome?.split(' ')[0]}</span>
                <ChevronDown className="size-3.5 text-white/75" />
              </button>

              {menuOpen && (
                <div className="header-dropdown absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-gray-100 text-xs text-gray-500">
                    Conectado como <strong className="text-gray-900 block truncate">{user.nome}</strong>
                  </div>
                  <Link
                    to={getDashboardRoute(user.tipoUsuario)}
                    onClick={() => setMenuOpen(false)}
                    className="dropdown-item block px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5F688F] text-decoration-none font-medium"
                  >
                    Meu Painel
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition text-decoration-none"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="header-btn-register inline-flex items-center gap-1.5 bg-white text-[#5F688F] hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold transition text-decoration-none shadow-xs"
              >
                Cadastrar Grátis
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition cursor-pointer bg-transparent border-0"
          aria-label="Menu"
        >
          {mobileDrawerOpen ? <X className="size-6 text-white" /> : <Menu className="size-6 text-white" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden bg-[#5F688F] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileDrawerOpen(false)}
            className={`block px-3 py-2 rounded-md font-semibold text-decoration-none ${
              isCurrent('/') ? 'text-white bg-white/20' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Início
          </Link>
          <Link
            to="/catalogo"
            onClick={() => setMobileDrawerOpen(false)}
            className={`block px-3 py-2 rounded-md font-semibold text-decoration-none ${
              isCurrent('/catalogo') ? 'text-white bg-white/20' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Catálogo
          </Link>
          <Link
            to="/contato"
            onClick={() => setMobileDrawerOpen(false)}
            className={`block px-3 py-2 rounded-md font-semibold text-decoration-none ${
              isCurrent('/contato') ? 'text-white bg-white/20' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Contato
          </Link>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardRoute(user.tipoUsuario)}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="mobile-btn-register w-full text-center bg-white text-[#5F688F] py-2.5 rounded-xl font-semibold text-decoration-none"
                >
                  Dashboard ({user.nome?.split(' ')[0]})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center text-rose-200 py-2 rounded-xl font-medium border border-rose-300/40 bg-transparent"
                >
                  Sair da conta
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full text-center border border-white/30 text-white py-2 rounded-xl font-semibold text-decoration-none hover:bg-white/10"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="mobile-btn-register w-full text-center bg-white text-[#5F688F] py-2.5 rounded-xl font-semibold text-decoration-none hover:bg-gray-100"
                >
                  Cadastrar Grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
