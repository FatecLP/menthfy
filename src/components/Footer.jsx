import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Modern structured footer component for Menthfy.
 */
export default function Footer() {
  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="menthfy-footer bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-block text-decoration-none">
              <span className="font-['Baumans'] text-3xl font-bold text-white tracking-tight">
                menthfy
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Plataforma de mentorias e aulas particulares que conecta alunos e educadores para um aprendizado individualizado e de alta qualidade.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse-ring" />
              <span>Todos os serviços operando normalmente</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition text-decoration-none">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-slate-400 hover:text-white transition text-decoration-none">
                  Catálogo de Mentores
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-slate-400 hover:text-white transition text-decoration-none">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Conta</h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition text-decoration-none">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-slate-400 hover:text-white transition text-decoration-none">
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link to="/recuperar" className="text-slate-400 hover:text-white transition text-decoration-none">
                  Recuperar Senha
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="m-0">&copy; {new Date().getFullYear()} Menthfy. Todos os direitos reservados.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-white transition cursor-pointer bg-transparent border-0 text-slate-400 p-0 text-xs"
          >
            Voltar ao topo ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
