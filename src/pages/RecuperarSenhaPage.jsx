import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuestGuard from '../components/GuestGuard';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRecuperar(e) {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      await Swal.fire({
        icon: 'error',
        title: 'E-mail inválido',
        text: 'Informe um e-mail válido.',
      });
      return;
    }

    setLoading(true);

    try {
      await Swal.fire({
        icon: 'success',
        title: 'E-mail enviado',
        text: `Um e-mail de recuperação foi enviado para ${trimmedEmail}`,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro, tente novamente mais tarde.',
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
            <form className="login-container" id="recuperarForm" onSubmit={handleRecuperar}>
              <h2 className="text-center mb-3">Recuperar Senha</h2>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail cadastrado
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
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar recuperação'}
              </button>
              <div className="form-actions">
                <Link to="/login">Já tenho conta</Link>
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
