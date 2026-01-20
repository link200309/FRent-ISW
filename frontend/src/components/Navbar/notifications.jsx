import React from "react";
import PropTypes from "prop-types";
import "./Navbar.css";
import { Link } from "react-router-dom";

function NotificationModal({
  isVisible,
  notifications,
  deleteNotifications, 
  readNotifications,
  onClose
}) {

  const calculateTimePassed = (createdAt) => {
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

  const readingNotification = (reading) => {
    return reading ? "leído" : "no leído";
  };

  const styleRead = (reading) => {
    return reading ? "reading" : "no_reading";
  };

  const styleCardIsRead = (reading) => {
    return reading ? "" : "no_reading_card";
  };

  return (
    isVisible && (
      <div className="modal-notification">
      <button className="boton-notificaciones" onClick={onClose}>X</button>
        <div className="title_notification">
          <h2>Notificaciones</h2>
          <div className="tooltip">
            <button onClick={deleteNotifications}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
                  fill="currentColor"
                />
                <path d="M9 9H11V17H9V9Z" fill="currentColor" />
                <path d="M13 9H15V17H13V9Z" fill="currentColor" />
              </svg>
            </button>
            <span className="tooltiptext">Vaciar bandeja</span>
          </div>

          <div className="tooltip">
            <button onClick={readNotifications}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2426 16.3137L6 12.071L7.41421 10.6568L10.2426 13.4853L15.8995 7.8284L17.3137 9.24262L10.2426 16.3137Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 5C1 2.79086 2.79086 1 5 1H19C21.2091 1 23 2.79086 23 5V19C23 21.2091 21.2091 23 19 23H5C2.79086 23 1 21.2091 1 19V5ZM5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <span className="tooltiptext">Marcar como leidos</span>
          </div>
        </div>

        {notifications.length > 0 ? (
          notifications.map((notification, key) => (
            <div
              key={key}
              className={`card-modal-notification ${styleCardIsRead(
                notification.is_reading
              )}`}
            >
              <img
                src={`data:image/png;base64,${notification.image}`}
                alt="Foto de perfil"
              />
              <div className="card-text">
                <p className="name-card">{notification.friend_name}</p>
                <p>{notification.message}</p>
                <Link to="chat2">Comienza a chatear</Link>
                <div className="footer_notification">
                  <p className="timePassed">
                    Hace {calculateTimePassed(notification.created)}
                  </p>
                  <p className={styleRead(notification.is_reading)}>
                    {readingNotification(notification.is_reading)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2>Sin notificaciones</h2>
        )}
      </div>
    )
  );
}

NotificationModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  notifications: PropTypes.array.isRequired,
  deleteNotifications: PropTypes.func.isRequired,
  readNotifications: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationModal;
