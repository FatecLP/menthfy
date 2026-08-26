import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContatoPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();

    if (!trimmedEmail || !trimmedSubject || !trimmedDescription) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, insira um e-mail válido.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (trimmedSubject.length > 100) {
      Swal.fire({
        title: 'Atenção!',
        text: 'O assunto não pode ultrapassar 100 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (trimmedDescription.length > 1000) {
      Swal.fire({
        title: 'Atenção!',
        text: 'A descrição não pode ultrapassar 1000 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await Swal.fire({
        title: 'Sucesso!',
        text: 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!',
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      if (result.isConfirmed) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, color: '#111827' }}>
        <section className="contact-section">
          <h2>Entre em Contato</h2>
          <p>Tem dúvidas? Entre em contato com nosso suporte</p>

          <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Assunto:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Assunto da mensagem"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição:</label>
              <textarea
                id="description"
                name="description"
                rows="6"
                required
                placeholder="Descreva seu problema ou dúvida..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
