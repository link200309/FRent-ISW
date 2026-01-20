import React from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className='home-description'>
          <h1 className="home-title">Bienvenido a Alquiler de amigos</h1>
          <p>¿Necesitas compañía para un evento especial? ¿Quieres descubrir nuevos lugares en compañía de alguien que comparta tus intereses? ¡Estás en el lugar adecuado!</p>
          <NavLink to="/form" className="home-button">Descubre más</NavLink>
        </div>
      </div>
    </div>
  );
}
