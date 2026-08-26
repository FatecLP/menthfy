import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuestGuard from '../components/GuestGuard';
import { loginUser } from '../services/api';
import { setStoredUser, getDashboardRoute } from '../utils/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !senha) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Preencha todos os campos!',
      });
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email.trim(), senha);
      setStoredUser(data.usuario);

      await Swal.fire({
        title: 'Login realizado com sucesso!',
        text: `Bem-vindo(a), ${data.usuario.nome}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(getDashboardRoute(data.usuario.tipoUsuario));
    } catch (error) {
      console.error('Erro ao logar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Erro ao tentar logar. Tente novamente.',
        footer: '<a href="#">Por que estou tendo esse problema?</a>',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <GuestGuard>
        <main className="split-screen" style={{ flex: 1 }}>
          <section className="split-left"></section>
          <section className="split-right">
            <form className="login-container" id="loginForm" onSubmit={handleLogin}>
              <h2 className="text-center mb-3">Entrar na sua conta</h2>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="senha" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="senha"
                  name="senha"
                  required
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <div className="form-actions">
                <Link to="/recuperar">Esqueci a senha</Link>
                <Link to="/cadastro">Cadastrar</Link>
              </div>
            </form>
          </section>
        </main>
      </GuestGuard>
      <Footer />
    </div>
  );
}
