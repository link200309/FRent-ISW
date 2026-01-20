import React, { useState, useEffect } from 'react';
import { get_acepted_friends, save_comment, likes_friend_post } from "../../api/register.api";
import { getUser } from "../../pages/Login/LoginForm";
import './MisAmigos.css';
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const MisAmigos = () => {
  const [amigos, setAmigos] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAmigo, setSelectedAmigo] = useState(null);
  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState({});
  const dataUser = getUser();
  const MAX_COMMENT_LENGTH = 150; // Limite de caracteres

  const getImage = (imageFriend) => {
    if (imageFriend) {
      return `data:image/png;base64,${imageFriend}`;
    }
    //return staticImage;
  };
  
  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const response = await get_acepted_friends(dataUser.user_id);
        setAmigos(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchAmigos();
  }, [dataUser.user_id]);

  const showForm = (amigo) => {
    setSelectedAmigo(amigo);
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
    setSelectedAmigo(null);
    setComment('');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentData = {
      rent_id: selectedAmigo.rent_id,
      friend_id: selectedAmigo.friend_id,
      client_id: dataUser.user_id,
      comment: comment,
    };

    try {
      await save_comment(commentData);
      hideForm();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const toggleLikeHandler = async (friendId) => {
    try {
      await likes_friend_post(friendId, !likes[friendId]);
      setLikes((prevLikes) => ({
        ...prevLikes,
        [friendId]: !prevLikes[friendId],
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="mis-amigos">
      <h1>Mi Historial de Amigos</h1>
      {amigos.length === 0 ? (
        <p>Aun no tienes amigos en Frent o no tienes ningun Alquiler concluido, ve y <Link to="/listfriend" className="link-list-friend">Alquila</Link> uno</p>
      ) : (
        amigos.map((amigo) => (
          <div key={amigo.friend_id} className="amigo-card">
            <div className="amigo-info">
              <img src={getImage(amigo.friend_photo)} alt="" />
              <div className="amigo-details">
                <strong>{amigo.friend_full_name}</strong>
                <p>{amigo.friend_description}</p>
              </div>
            </div>
            <div className="amigo-action">
              <span>Alquiler hace {amigo.rent_done}</span>
              <div className="action-buttons">
                <button onClick={() => showForm(amigo)} className="comment-button">Dejar Comentario</button>
                <button onClick={() => toggleLikeHandler(amigo.friend_id)} className="like-button">
                  {likes[amigo.friend_id] ? <FaHeart color="black" /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      {isFormVisible && (
        <div className="comment-form-overlay">
          <div className="comment-form">
            <h2>Dejar Comentario para {selectedAmigo?.friend_full_name}</h2>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                required
                placeholder="Escribe tu comentario aquí (0/150)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={MAX_COMMENT_LENGTH} // Límite de caracteres
              ></textarea>
              {comment.length >= MAX_COMMENT_LENGTH ? (
                <p style={{ color: 'red' }}>HAS SUPERADO EL LÍMITE DE CARACTERES</p>
              ) : (
                <p></p>
              )}
              <div className="form-buttons">
                <button type="submit" disabled={comment.length > MAX_COMMENT_LENGTH}>Enviar</button>
                <button type="button" onClick={hideForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisAmigos;