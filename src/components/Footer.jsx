import React from 'react';

export default function Footer() {
  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="footer-1">
      <div className="footer-left">
        <h1>menthfy</h1>
      </div>
      <div className="footer-center">
        <div className="icones">
          <a href="#top" aria-label="Facebook">
            <img src="/assets/icons/facebook.png" alt="Facebook" />
          </a>
          <a href="#top" aria-label="Instagram">
            <img src="/assets/icons/instagram.png" alt="Instagram" />
          </a>
          <a href="#top" aria-label="X">
            <img src="/assets/icons/x.png" alt="X (Twitter)" />
          </a>
          <a href="#top" aria-label="LinkedIn">
            <img src="/assets/icons/in.png" alt="LinkedIn" />
          </a>
          <a href="#top" aria-label="YouTube">
            <img src="/assets/icons/youtube-app-white-icon 1.png" alt="YouTube" />
          </a>
        </div>
        <span className="footer-copy">Copyright &copy; 2026 | Menthfy - Todos os direitos reservados.</span>
      </div>
      <div className="footer-right">
        <a href="#top" className="topo-btn" onClick={scrollToTop}>
          Topo
        </a>
      </div>
    </div>
  );
}
