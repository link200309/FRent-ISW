import React, { useEffect, useState } from "react";
import "./profileEdits.css"; // Archivo de estilos CSS
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { ButtonPrimary } from "../../components/Buttons/buttonPrimary";
import { NavLink, useParams } from "react-router-dom";
import { getClientID, get_likes_user } from "../../api/register.api";
import { calculateAge } from "../listFriend/ListFriends";

const ProfileClient = () => {
  const { id } = useParams();
  const clientId = parseInt(id);
  const [client, setClient] = useState([]);
  const [interests, setInterest] = useState([]);

  useEffect(() => {
    async function loadClient() {
      let res = await getClientID(clientId);
      setClient(res.data);
    }

    async function loadInterests() {
      const idClient = {
        id_user: clientId,
      };
      const res = await get_likes_user(idClient);
      setInterest(res.data.gustos);
    }

    if (clientId) loadClient();
    if (clientId) loadInterests();
  }, []);

  function capitalizarPrimeraLetra(cadena) {
    if (typeof cadena === 'string' && cadena.length > 0) {
      return cadena.charAt(0).toUpperCase() + cadena.slice(1);
    }
    return '';
  }
 
  return (
    <div className="information-user">
      <div className="user-profile">
        <div className="prev-perfil">
        <div className="user-card">
          <div className="image-profile">
            <img
              src={`data:image/png;base64,${client.image}`}
              alt="Profile"
              className="user-avatar"
            />
          </div>
          <h2 className="user-name">{`${client.first_name} ${client.last_name}`}</h2>
          <div className="user-details">
            <p>Edad: {calculateAge(client.birth_date)}</p>
            <p>Género: {' '}
                  {client.gender ? capitalizarPrimeraLetra(client.gender) : 'No especificado'}</p>
            <p className="location-container">
              <IoLocationSharp className="icon" />{" "}
              {`${client.country} / ${client.city}`}
            </p>
            <p >
              <RiVerifiedBadgeFill className="icon" /> Verificado
            </p>
            </div>
          </div>          
          </div>
        <div className="user-description">
          <h2>Descripción Personal:</h2>
          <p>{client.personal_description}</p>
          <h2>Intereses:</h2>
          <div className="user-interests">
            {interests.map((interest, index) => (
              <span key={index} className="interest-selected">
                <svg
                  className="tag-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.8em"
                    height="0.8em"
                    viewBox="0 0 20 20"
                >
                  <path
                    fill="white"
                    d="M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42"
                  />
                </svg>
                {interest}
              </span>
            ))}
          </div>
          <div className="btn-back-reserve">
            <NavLink to="/rentalSectio">
              <ButtonPrimary label={"Atrás"} />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
