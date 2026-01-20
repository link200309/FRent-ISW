import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./profileEdits.css";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { ButtonPrimary } from "../../components/Buttons/buttonPrimary";
import { ButtonPersonal } from "../../components/Buttons/buttonPersonal";
import { getFriendID2, getLikes, get_friend_comments } from "../../api/register.api";
import { calculateAge } from "../listFriend/ListFriends";
import CommentSection from './CommentSection';
import { getUser } from "../../pages/Login/LoginForm";

const ProfileFriend = () => {
  const { id } = useParams();
  const friendId = parseInt(id);
  const [friend, setFriend] = useState([]); // Utiliza un único amigo en lugar de una lista de amigos
  const dataUser = getUser();
  const [comments, setComments] = useState([]);


  useEffect(() => {
    const loadFriend = async () => {
      try {
        const res = await getFriendID2(friendId);
        setFriend(res.data); // Establece el amigo individual obtenido
      } catch (error) {
        console.error("Error al cargar la información del amigo:", error);
      }
    };
    const loadComments = async () => {
      try {
        const response = await get_friend_comments(friendId);
        setComments(response.data);
      } catch (error) {
        console.error("Error al cargar los comentarios:", error);
      }
    };
    loadFriend();
    loadComments();
  }, [friendId]);

  const staticImage =
    "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg";

  const getImage = (imageFriend) => {
    if (imageFriend) {
      return `data:image/png;base64,${imageFriend}`;
    }
    return staticImage;
  };

  function capitalizarPrimeraLetra(cadena) {
    if (typeof cadena === 'string' && cadena.length > 0) {
      return cadena.charAt(0).toUpperCase() + cadena.slice(1);
    }
    return '';
  }
  return (
    <div className="information-user">
      <div className="user-profile">
        <div className="alquilar-perfil">
          <div className="user-center-b">
            <div className="user-card">
              <div className="image-profile">
                <img
                  src={getImage(friend.image)}
                  alt="Profile"
                  className="user-avatar"
                />
              </div>
              <h2 className="user-name">
                {friend.first_name} {friend.last_name}
              </h2>
              <div className="user-details">
                <p>Edad: {calculateAge(friend.birth_date)}</p>
                <p>
                  Género:{' '}
                  {friend.gender ? capitalizarPrimeraLetra(friend.gender) : 'No especificado'}
                </p>
                <p className="location-container">
                  <IoLocationSharp className="location-icon" />
                  <span>{`${friend.country} / ${friend.city}`}</span>
                </p>
                <p className="verified-container">
                  <RiVerifiedBadgeFill className="verified-icon" />
                  <span className="verified-text">Verificado</span>
                </p>
                <p className="user-price">{friend.price} BOB/hora</p>
              </div>
            </div>
            <NavLink to={`/rentaForm/${friendId}`}>
              <div className="btn-back-alquilar">
                <ButtonPersonal label={"Alquilar"} />
              </div>
            </NavLink>
             
          </div>
          
        </div>
        <div className="user-description">
          <h3>Descripción personal:</h3>
          <p>{friend.personal_description}</p>
          <h3>Intereses:</h3>
          <div className="user-interests">
            {friend && friend.gustos ? (
              friend.gustos.map((interest, index) => (
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
              ))
            ) : (
              <p>No tiene intereses</p>
            )}
          </div>
          <h3>Comentarios:</h3>
          <div className="comment-section-container">
            <CommentSection comments={comments} clientName={friend.client_full_name} />
          </div>
          <div className="btn-back-reserve">
          <NavLink className="viewReserv" to={`/calendarReservas/${friendId}`}>
                Mostrar reservas
              </NavLink> 
            <NavLink to="/listFriend">
              <ButtonPrimary label={"Atrás"} />
            </NavLink>
           
          </div>
        </div>
      </div>
    </div>
    
  );
};  

export default ProfileFriend;