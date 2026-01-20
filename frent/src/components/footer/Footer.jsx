import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div>
      <footer className="pie-pagina">
        <div className="grupo-1">
          <div className="box">
            <figure>
              <a href="/">
                <img
                  src="https://i.ibb.co/hZwZSSN/Logo-frent.png"
                  alt="Logo de SLee Dw"
                />
              </a>
            </figure>
          </div>
          <div className="box">
            <h2>SOBRE FRENT</h2>
            <p>
              Somos un plataforma donde podras alquilar amigos segun tus gustos
              e intereses
            </p>
            <p>¿Te sientes muy solo? Alquila un amigo!</p>
          </div>
          <div className="box">
            <h2>Nuestras redes sociales:</h2>
            <div className="red-social">
              <a href="https://www.facebook.com/">
                <div className="icon-footer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                    />
                  </svg>
                </div>
              </a>

              <a href="https://www.instagram.com/">
                <div className="icon-footer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                    />
                  </svg>
                </div>
              </a>

              <a href="https://x.com/">
                <div className="icon-footer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="currentColor"
                      d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05zM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843z"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="grupo-2">
          <small>
            &copy; 2024 <b>Punto y Coma && QAquest</b> - Todos los Derechos
            Reservados.
          </small>
          <div className="cta">
            <br />
          </div>
        </div>
      </footer>
    </div>
  );
}
