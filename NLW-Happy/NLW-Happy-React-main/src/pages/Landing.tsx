import React from 'react';
import '../styles/global.css';
import '../styles/pages/landing.css';
import { Link } from 'react-router-dom';

import logoImg from '../images/Logo.svg';
import { FiArrowRight } from 'react-icons/fi';

export default function Landing() {
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <img src={logoImg} alt="Happy" />
        <main>
          <h1>Leve a felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças</p>
        </main>
        <div className="location">
          <strong>Novo Hamburgo</strong>
          <span>Rio Grande do Sul</span>
        </div>
        <Link to="/app" className="enter-app">
          <FiArrowRight size={26} color="rgba(0 , 0, 0, 0.2)" />
        </Link>
      </div>
    </div>
  );
}
