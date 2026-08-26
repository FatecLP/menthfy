import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/global/colors.css';
import './styles/global/fonts.css';
import './styles/global/main.css';
import './styles/components/header.css';
import './styles/components/footer.css';
import './styles/components/card.css';
import './styles/components/already-logged.css';
import './styles/pages/login.css';
import './styles/pages/cadastro.css';
import './styles/pages/recuperar.css';
import './styles/pages/catalog.css';
import './styles/pages/contato.css';
import './styles/pages/dashboard.css';
import './styles/pages/video-call.css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
