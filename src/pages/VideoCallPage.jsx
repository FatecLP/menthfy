import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { getStoredUser } from '../utils/auth';

export default function VideoCallPage() {
  const user = getStoredUser();
  const tipo = (user?.tipoUsuario || 'Aluno').toLowerCase();

  const [connected, setConnected] = useState(false);
  const [connectingText, setConnectingText] = useState('Conectando');
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setConnectingText('Conectando' + '.'.repeat(dots));
    }, 400);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setConnected(true);
      setConnectingText('Conectado');
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages((prev) => [...prev, { text: 'Olá! Seja bem-vindo(a) à sessão.', me: false }]);
    }, 600);

    const timer2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: tipo === 'professor' ? 'Alunos conectados: 3' : 'Professor conectado: Professor João',
          me: false,
        },
      ]);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [tipo]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function handleSendMessage(e) {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { text, me: true }]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: `Mensagem automática: Recebido — ${text}`, me: false }]);
    }, 900 + Math.random() * 700);
  }

  function handleScreenShare() {
    setScreenSharing(true);
    setTimeout(() => setScreenSharing(false), 900);
  }

  const participants =
    tipo === 'professor' ? ['Aluno 1', 'Aluno 2', 'Aluno 3'] : ['Professor João', 'Assistente'];

  return (
    <AuthGuard>
      <div className="vc-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main className="vc-main" style={{ flex: 1 }}>
          <div className="vc-left">
            <div className="vc-video-area">
              <div className="vc-main-tile">
                <div className={`video-placeholder ${!connected ? 'pulse' : ''}`} id="mainVideo">
                  <div className="connection-status">
                    <span id="connectingDots">{connectingText}</span>
                  </div>
                </div>
                <div className="controls">
                  <button id="btnMute" className="btn" onClick={() => setMuted(!muted)}>
                    {muted ? 'Ativar som' : 'Silenciar'}
                  </button>
                  <button id="btnCam" className="btn" onClick={() => setCameraOff(!cameraOff)}>
                    {cameraOff ? 'Ligar câmera' : 'Câmera'}
                  </button>
                  <button
                    id="btnScreen"
                    className={`btn ${screenSharing ? 'pulse' : ''}`}
                    onClick={handleScreenShare}
                  >
                    Compartilhar tela
                  </button>
                </div>
              </div>

              <div className="vc-thumbnails" id="thumbnails">
                {participants.map((name, index) => (
                  <div key={index} className="thumb">
                    <div className="name">{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="vc-chat" id="chatPanel">
            <div className="chat-header">
              <h3 id="vcTitle">{tipo === 'professor' ? 'Videochamada — Professor' : 'Videochamada — Aluno'}</h3>
              <div id="participantRole" className="role-badge">
                {tipo === 'professor' ? 'Professor' : 'Aluno'}
              </div>
            </div>

            <div className="messages" id="messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`message ${m.me ? 'me' : ''}`}>
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form id="chatForm" className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                id="chatInput"
                placeholder="Escreva uma mensagem..."
                autoComplete="off"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn primary">
                Enviar
              </button>
            </form>
          </aside>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
