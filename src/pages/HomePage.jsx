import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div id="top" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1 }}>
        <div className="image">
          <Header isHome={true} />
          <div className="mod2"></div>
          <div className="mod"></div>
          <div className="titulo">
            <h2>ENCONTRE O MENTOR IDEAL PARA VOCÊ</h2>
            <p>Encontre o professor certo ao seu alcance</p>
          </div>
        </div>
        <section className="principal">
          <div className="marca" aria-label="Sobre o Menthfy">
            <img className="marca-logo" src="/assets/images/menthfylogo.png" alt="Logomarca Menthfy" />
            <div className="marca-texto">
              <h3>O QUE É O MENTHFY?</h3>
              <p>
                Menthfy é uma plataforma online para contratação de professores, educadores e mentores que estejam próximos de você, trazendo ensino de qualidade e buscando incentivar novos professores a aprimorarem seus meios de ensino.
              </p>
            </div>
          </div>
          <img src="/assets/images/proftxt.png" alt="Texto sobre professores" style={{ maxWidth: '100%', height: 'auto' }} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
