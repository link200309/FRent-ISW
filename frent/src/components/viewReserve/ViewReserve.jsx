import React, { useEffect, useState, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaUserFriends,
  FaCalendar,
  FaClock,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { BiSolidMessageDetail } from "react-icons/bi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { UserContext } from "../../pages/Login/UserProvider";
import swal from "sweetalert2";
import "./ViewReserve.css";
import "./Details.css";
import {
  get_likes_user,
  deleteRent,
  create_notification,
  createNotication,
  getClientID,
  getFriendID,
  update_pending_rent,
  getPendingRent,
} from "../../api/register.api";
import { getUser } from "../../pages/Login/LoginForm";

export const calculateTimePassed = (createdAt) => {
  const currentTime = new Date();
  const createdAtDate = new Date(createdAt);
  const difference = currentTime.getTime() - createdAtDate.getTime();
  const secondsPassed = Math.floor(difference / 1000);
  if (secondsPassed < 60) {
    return `${secondsPassed} seg`;
  } else if (secondsPassed < 3600) {
    return `${Math.floor(secondsPassed / 60)} min`;
  } else if (secondsPassed < 86400) {
    return `${Math.floor(secondsPassed / 3600)} horas`;
  } else {
    return `${Math.floor(secondsPassed / 86400)} días`;
  }
};

export default function ViewReserve() {
  const { userData } = useContext(UserContext);
  const [listRent, setListRent] = useState([]);
  const [likes_user, setLikesUser] = useState([]);
  const [selectedRent, setSelectedRent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const userData2 = getUser();

  const staticImage =
    "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (listRent.length > 0) {
      const fetchDataForLikes = async () => {
        try {
          const likesPromises = listRent.map(async (rent) => {
            const idClient = {
              id_user: rent.client_id,
            };
            const resLikesUser = await get_likes_user(idClient);
            return resLikesUser.data || [];
          });
          const likesData = await Promise.all(likesPromises);
          setLikesUser(likesData.flat());
        } catch (error) {
          console.error("Error fetching likes data:", error);
        }
      };
      fetchDataForLikes();
    }
  }, [listRent]);

  const fetchData = async () => {
    try {
      const resRent = await getPendingRent(userData2.user_id);
      if (resRent && resRent.data) {
        const sortedRent = resRent.data.sort((a, b) => {
          const dateA = new Date(a.created);
          const dateB = new Date(b.created);
          return dateB - dateA;
        });
        setListRent(sortedRent);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  

  const handleAccept = async (rentId, rentClient, rentFriend) => {
    try {
      const result = await swal.fire({
        title: "¿Aceptas ser el amigo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });
      if (result.isConfirmed) {
        const hasConflict = checkTimeConflict(rentId);
        if (hasConflict) {
         /*const conflictingRent = listRent.find(
            (rent) => 
              rent.status === "Aceptado" &&
        rent.fecha_cita === fecha_cita &&
        rent.time === time
          ); */

          /* const dataNotification = {
            message: `No se puede aceptar el alquiler. Hay otro alquiler aceptado en la misma fecha y hora: ${conflictingRent.nombre_cliente}`,
            from_user: rentFriend,
            to_user: rentClient,
            is_reading: false,
          }; */

          await create_notification(dataNotification);

          swal.fire({
            icon: "error",
            title: "Choque de horario",
            text: `No se puede aceptar el alquiler. Hay otro alquiler aceptado en la misma fecha y hora.`,
          });
          
          return;
        }

        sendFriendRequestEmail(rentClient, rentFriend, 1);
        const data = {
          status: "accepted",
        };
        await update_pending_rent(rentId, data);

        // console.log("el daots ess", res.data)

        const dataNotification = {
          message: "Acepto ser tu amigo de alquiler!",
          from_user: rentFriend,
          to_user: rentClient,
          is_reading: false,
        };

        await create_notification(dataNotification);
        fetchData();
        swal.fire({
          icon: "success",
          title: "¡Aceptado!",
          text: "Has aceptado ser el amigo de alquiler.",
        });
      }
    } catch (error) {
      console.error("Error al aceptar el alquiler:", error);
    }
  };

  const checkTimeConflict = (currentRentId) => {
    const selectedRent = listRent.find(
      (rent) => rent.rent_id === currentRentId
    );
    if (!selectedRent) return false;

    const { time, duration, fecha_cita } = selectedRent;

    const startTime = new Date(`2000-01-01T${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    const hasAcceptedRentSameDateTime = listRent.some((rent) => {
      return (
        rent.status === "Aceptado" &&
        rent.fecha_cita === fecha_cita &&
        rent.time === time
      );
    });

    if (hasAcceptedRentSameDateTime) {
      return true;
    }

    const conflicts = listRent.filter((rent) => {
      if (rent.rent_id === currentRentId || rent.status !== "Aceptado")
        return false;

      const rentStartTime = new Date(`2000-01-01T${rent.time}`);
      const rentEndTime = new Date(
        rentStartTime.getTime() + rent.duration * 60 * 60 * 1000
      );

      if (
        fecha_cita === rent.fecha_cita &&
        ((startTime >= rentStartTime && startTime < rentEndTime) ||
          (endTime > rentStartTime && endTime <= rentEndTime) ||
          (startTime <= rentStartTime && endTime >= rentEndTime))
      ) {
        return true;
      }

      return false;
    });

    return conflicts.length > 0;
  };
  const handleReject = async (rentId, rentClient, rentFriend) => {
    try {
      const rejected = window.confirm(
        "¿Estás seguro de que deseas rechazar ser amigo?"
      );
      if (rejected) {
        sendFriendRequestEmail(rentClient, rentFriend, 0);
        await deleteRent(rentId);
        const dataNotification = {
          message: "Rechazo tu solicitud de alquiler :(",
          from_user: rentFriend,
          to_user: rentClient,
          is_reading: false,
        };
        await create_notification(dataNotification);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendFriendRequestEmail = async (clientID, friID, isApproved) => {
    try {
      const clientResponse = await getClientID(clientID);
      const clientEmail = clientResponse.data.email;
      const friendResponse = await getFriendID(friID);
      const firstt_name = friendResponse.data.first_name;
      const lastt_name = friendResponse.data.last_name;
      let combinedData;

      if (isApproved === 1) {
        combinedData = {
          email: clientEmail,
          estado_solicitud: "Aceptó",
          first_name: firstt_name,
          last_name: lastt_name,
        };
        // createNotification(combinedData);
        createNotication(combinedData);
      } else {
        combinedData = {
          email: clientEmail,
          estado_solicitud: "Rechazó",
          first_name: firstt_name,
          last_name: lastt_name,
        };
        createNotication(combinedData);
      }
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);

      // Verificar si el error es debido a un problema de red
      if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
        console.error(
          "No hay conexión a internet. El correo no pudo ser enviado."
        );
        // Aquí puedes agregar lógica adicional, como almacenar el correo en una cola para enviar más tarde
      } else if (error.message.includes("Network Error")) {
        console.error("Error de red. El correo no pudo ser enviado.");
        // Aquí puedes agregar lógica adicional, como almacenar el correo en una cola para enviar más tarde
      } else {
        console.error("Error desconocido al enviar el correo:", error);
        // Aquí puedes agregar lógica adicional para manejar otros tipos de errores
      }
    }
  };

  const getClientLikes = (clientId) => {
    const clientLikes = likes_user.find((like) => like.id_user === clientId);
    if (clientLikes) {
      return clientLikes.gustos;
    }
    return [];
  };

  const openModal = (rent, price) => {
    setSelectedRent({ ...rent, price }); // Agregar el precio al objeto del alquiler seleccionado
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedRent(null);
  };

  const getImage = (imageFriend) => {
    if (imageFriend) {
      return `data:image/png;base64,${imageFriend}`;
    }
    return staticImage;
  };

  const openModalPhoto = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeModalPhoto = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const DetailsModal = ({ isOpen, closeModal, rent }) => {
    if (!isOpen || !rent) return null;

    const modalClassName = `modal-wrapper ${isOpen ? "active" : ""}`;
    const overlayClassName = `overlay ${isOpen ? "active" : ""}`;

    return (
      <>
        <div className={overlayClassName} onClick={closeModal}>
          {" "}
        </div>
        <div className={modalClassName}>
          <div className="modal1">
            <div className="modal-header1">
              <div className="modalPrueba">
                <FaSearch className="icon1" />
                &nbsp; <strong>Detalles del alquiler</strong>
              </div>
              <AiOutlineClose
                className="icon1"
                size={30}
                color="#ff0000"
                onClick={closeModal}
                cursor={"pointer"}
              />
            </div>
            <div className="container1">
              <div className="user-info1">
                <img
                  //src={rent.profilePic || imgApp.image}
                  src={getImage(rent.image)}
                  className="fotoperfil"
                  alt="foto de perfil"
                  onClick={() => openModalPhoto(getImage(rent.image))}
                />
              </div>
              <div className="request-info1">
                <h3 className="name-client1">{rent.nombre_cliente}</h3>
                <div className="detalle1">
                  <p className="verified-date1">
                    <FaCalendar className="icon" />
                    {rent.fecha_cita}
                  </p>
                  <p className="locationR1">
                    <FaClock className="icon" />
                    {rent.time}
                  </p>
                </div>
                <div className="detalle1">
                  <p className="verified1">
                    <RiVerifiedBadgeFill className="icon" />
                    Verificado
                  </p>
                  <div className="icon-location2">
                    &nbsp;
                    <IoLocationSharp className="icon" />
                  </div>
                  <p className="locationR1">{rent.location}</p>
                </div>
              </div>
            </div>
            <div className="cuerpo1">
              <p>
                <strong>Duración:</strong>{" "}
              </p>
              <p>{rent.duration} horas</p>
              <h3>Precio</h3>
              <div className="PrecioDetail">
                <p>
                  {rent.price / rent.duration} Bs x {rent.duration}horas
                </p>
                <p>{rent.price} Bs</p>
              </div>
              <h3>Tipo de evento:</h3>
              <div className="descripcion">
                <p>
                  {rent.type_event ? rent.type_event : <i>No especificado</i>}
                </p>
              </div>
              <h3>Vestimenta del evento:</h3>
              <div className="descripcion">
                <p>
                  {rent.type_outfit ? rent.type_outfit : <i>No especificado</i>}
                </p>
              </div>
              <h3>Descripción:</h3>
              <div className="descripcion">
                <p>
                  {rent.description ? rent.description : <i>No especificado</i>}
                </p>
              </div>
              <p>
                <strong>Intereses:</strong>
              </p>
              {getClientLikes(rent.client_id).map((like) => (
                <p key={like} className="descriptionLike">
                  <svg
                    className="tag-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42"
                    />
                  </svg>{" "}
                  {like}
                </p>
              ))}
            </div>
            <div className="pie1">
              <p>
                <strong>Estado de la reserva:</strong>
              </p>
              <p className="pie.estado1">
                <span>{rent.status}</span>
              </p>
            </div>
          </div>
        </div>

        {selectedImage && (
          <div className="modalF">
            <div className="modal-content">
              <button className="close" onClick={closeModalPhoto}>
                Cerrar
              </button>
              <img
                src={selectedImage}
                alt="imagen en tamaño grande"
                height="500px"
                width="500px"
              />
            </div>
          </div>
        )}
        {selectedImage && <div className="modal-background"></div>}
      </>
    );
  };

  return (
    <>
      <div className="contV">
        <div>
          <h1 className="title">
            <FaUserFriends className="icon" />
            Alquileres Pendientes
          </h1>
        </div>
        <div id="pendings">
          {listRent.length === 0 ? (
            <div className="placeholder-container">
              <p className="placeholder-text">
                No existen solicitudes de alquileres pendientes
              </p>
            </div>
          ) : (
            listRent.map((rent, index) => (
              <div key={rent.rent_id} className="pending">
                <div className="pending-info">
                  <div className="user-info2">
                    <img
                      src={getImage(rent.image)}
                      className="fotoperfil"
                      alt="foto de perfil"
                      onClick={() => openModalPhoto(getImage(rent.image))}
                    />
                    <p className="time">
                      Hace {calculateTimePassed(rent.created)}
                    </p>
                  </div>
                  <div className="request-info">
                    <h3 className="name-client">{rent.nombre_cliente}</h3>
                    <div className="details">
                      <p className="verified-date">
                        <FaCalendar className="icon" />
                        {rent.fecha_cita}
                      </p>
                      <p className="locationR">
                        <FaClock className="icon" />
                        {rent.time}
                      </p>
                    </div>
                    <div className="details">
                      <p className="verified">
                        <RiVerifiedBadgeFill className="icon" />
                        Verificado
                      </p>
                      <p className="locationR">
                        <IoLocationSharp className="icon" />
                        {rent.location}
                      </p>
                    </div>

                    <div className="price-details">
                      <div className="price-container">
                        <p className="price">{rent.price}Bs</p>
                        <button
                          className="details-button"
                          onClick={() => openModal(rent, rent.price)}
                        >
                          <FaSearch className="icon" />
                          Detalles
                        </button>
                        <NavLink className="" to={`/profileClient/${rent.client_id}`}>
                          <button className="details-button">
                            <FaUserCircle className="icon" />
                            Ver Perfil
                          </button>
                        </NavLink>
                      </div>
                    </div>
                    {rent.status === "Aceptado" && (
                          <NavLink className="" to={`/chat`}>
                            <button className="details-button">
                            <BiSolidMessageDetail className="icon"/>¿Quieres ir a chatear?
                            </button>
                          </NavLink>
                        )}
                  </div>
                </div>
                <hr></hr>

                {rent.status !== "Aceptado" &&
                  rent.status !== "Rechazado" &&
                  (!checkTimeConflict(rent.rent_id) ? (
                    <div className="action-buttons">
                      <button
                        className="btnV"
                        onClick={() =>
                          handleAccept(
                            rent.rent_id,
                            rent.client_id,
                            rent.friend_id
                          )
                        }
                      >
                        Aceptar
                      </button>
                      <button
                        className="btnVR"
                        onClick={() =>
                          handleReject(
                            rent.rent_id,
                            rent.client_id,
                            rent.friend_id
                          )
                        }
                      >
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="already-accepted">
                        Ya existe un alquiler aceptado en esta fecha y hora
                      </p>
                    </>
                  ))}
                {/* Renderiza el modal si se ha seleccionado un alquiler */}
                <DetailsModal
                  isOpen={selectedRent !== null}
                  closeModal={closeModal}
                  rent={selectedRent}
                />
              </div>
            ))
          )}
        </div>
      </div>
      {selectedImage && (
        <div className="modalF">
          <div className="modal-content">
            <button className="close" onClick={closeModalPhoto}>
              Cerrar
            </button>
            <img
              src={selectedImage}
              alt="imagen en tamaño grande"
              height="500px"
              width="500px"
            />
          </div>
        </div>
      )}
      {selectedImage && <div className="modal-background"></div>}
    </>
  );
}
