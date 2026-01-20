import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import ChatList from "./chatList/ChatList";
import { IoIosArrowBack } from "react-icons/io";
import { getUser } from "../../pages/Login/LoginForm";
import { getMessagesUser } from "../../api/register.api";
import { calculateTimePassed } from "../viewReserve/ViewReserve";
import { Link } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [messageHistory2, setMessageHistory2] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(true);
  const dataUser = getUser();
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [timeSinceLastMessage, setTimeSinceLastMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [isMessageEmpty, setIsMessageEmpty] = useState(true);

  const roomName = dataUser.user_type;

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (messages2.length > 0) {
      const latestMessage = messages2[messages2.length - 1];
      setLastMessage(latestMessage.message);
      setTimeSinceLastMessage(calculateTimePassed(latestMessage.date));
    }
  }, [messages2]);

  useEffect(() => {
    if (dataUser && selectedUser) fetchData();
  }, [selectedUser]);

  useEffect(() => {
    if (messages2 || messageHistory2) {
      setMessages2((prev) => prev.concat(messageHistory2));
    }
  }, [messageHistory2]);

  const fetchData = async () => {
    const idOther =
      dataUser.user_type === "Amigo"
        ? selectedUser.client_id
        : selectedUser.id_user;
    let informacion = {};
    if (dataUser.user_type === "Cliente") {
      informacion = {
        sender: dataUser.user_id,
        receiver: idOther,
      };
    } else {
      informacion = {
        sender: idOther,
        receiver: dataUser.user_id,
      };
    }
    try {
      const res = await getMessagesUser(informacion);
      setMessages2(res.data);
    } catch (error) {
      console.error("Error al obtener los mensajes del usuario:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.close();
    }
    const connectWebSocket = () => {
      if (selectedUser) {
        const idOther =
          dataUser.user_type === "Amigo"
            ? selectedUser.client_id
            : selectedUser.id_user;

        let ws;
        if (dataUser.user_type === "Cliente") {
          ws = new WebSocket(
            `ws://localhost:9000/ws/chat/${dataUser.user_id}/${idOther}/`
          );
          // ws = new WebSocket(
          //   `wss://deploy-is-production.up.railway.app/ws/chat/${dataUser.user_id}/${idOther}/`
          // );
        } else {
          ws = new WebSocket(
            `ws://localhost:9000/ws/chat/${idOther}/${dataUser.user_id}/`
          );
          // ws = new WebSocket(
          //   `wss://deploy-is-production.up.railway.app/ws/chat/${idOther}/${dataUser.user_id}/`
          // );
        }

        ws.onopen = () => {
          console.log("Conexión WebSocket abierta");
          const message = {
            sender: "React Client",
            message: "Hola desde el cliente React",
          };
          ws.send(JSON.stringify(message));
        };

        ws.onmessage = (e) => {
          try {
            const message = JSON.parse(e.data);
            console.log("Mensaje recibido desde el servidor:", message);

            setMessageHistory2(message);

            setMessages((prevMessages) => {
              const newMessages = [
                ...prevMessages,
                {
                  id: prevMessages.length + 1,
                  text: message.message,
                  isIncoming: true, // Indica que es un mensaje entrante
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  senderId: message.sender, // El remitente del mensaje
                },
              ];
              if (newMessages.length > 0) {
                const latestMessage = newMessages[newMessages.length - 1];
                setLastMessage(latestMessage.text);
                setTimeSinceLastMessage(
                  calculateTimePassed(latestMessage.time)
                );
              }

              return newMessages;
            });
          } catch (error) {
            console.error("Error al procesar el mensaje recibido:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("Error en la conexión WebSocket:", error);
        };

        ws.onclose = () => {
          console.log("Conexión WebSocket cerrada");
        };

        setSocket(ws); // Guardar la instancia del WebSocket en el estado
      } else {
        console.log("No hay usuario seleccionado para chatear");
      }
    };

    if (roomName) {
      connectWebSocket();
    }
  }, [roomName, selectedUser]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages2]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user && user.messages) {
      setMessages(user.messages);
    } else {
      setMessages([]);
    }
    setIsChatVisible(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipientID =
      dataUser.user_type === "Cliente"
        ? selectedUser.id_user
        : selectedUser.client_id;
    if (recipientID !== dataUser.user_id) {
      if (currentMessage.trim() !== "" && socket) {
        const newMessage = {
          id: messages.length + 1,
          text: currentMessage,
          isIncoming: false,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          recipientId: recipientID,
        };

        setMessages([...messages, newMessage]);
        setCurrentMessage("");
        setMessageLength(0);

        let senderId, recipientId, senderName, recipientName;

        if (dataUser.user_type === "Amigo") {
          senderId = dataUser.user_id;
          recipientId = selectedUser.client_id;
          senderName = dataUser.first_name;
          recipientName = selectedUser.nombre_cliente;
        } else {
          senderId = dataUser.user_id;
          recipientId = selectedUser.id_user;
          senderName = dataUser.first_name;
          recipientName = selectedUser.first_name;
        }

        const messagePayload = {
          sender: senderId,
          recipient: recipientId,
          message: currentMessage,
          senderName: senderName,
          recipientName: recipientName,
        };

        console.log("messagePayload:", messagePayload);
        socket.send(JSON.stringify(messagePayload));
      } else {
        console.log("no");
      }
    } else {
      console.log("hoasl");
    }
  };

  const handleBackButtonClick = () => {
    setSelectedUser(null);
    setIsChatVisible(false);
  };

  const formatMessageTime = (isoString) => {
    if (!isoString) {
      //console.error("Invalid date string:", isoString);
      return currentFormattedDate2;
    }

    try {
      // console.log("Attempting to parse date:", isoString);
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        // console.error("Date conversion failed for string:", isoString);
        return "Invalid Date";
      }
      // console.log("Successfully parsed date:", date);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      // console.error("Error formatting date:", error, isoString);
      return "Invalid Date";
    }
  };

  const getCurrentFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateLabel = (isoString) => {
    const currentFormattedDate = getCurrentFormattedDate();
    if (!isoString) {
      //console.error("Invalid date string:", isoString);
      return currentFormattedDate;
    }

    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const options = { weekday: "short", day: "2-digit", month: "2-digit" };

    if (date.toDateString() === today.toDateString()) {
      return "--Hoy--";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "--Ayer--";
    } else {
      return date.toLocaleDateString("es-ES", options);
    }
  };

  const groupedMessages = messages2.reduce((acc, message) => {
    const dateLabel = formatDateLabel(message.date);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(message);
    return acc;
  }, {});

  const MAX_MESSAGE_LENGTH = 150;

  const handleChangeMessage = (event) => {
    const message = event.target.value;
    if (message.length <= MAX_MESSAGE_LENGTH) {
      setCurrentMessage(message);
      setMessageLength(message.length);
    }
  };

  useEffect(() => {
    setIsMessageEmpty(currentMessage.trim() === "");
  }, [currentMessage]);

  const getCurrentFormattedDate2 = () => {
    const now = new Date();
    return now.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  console.log("como lohago ", selectedUser);
  const currentFormattedDate2 = getCurrentFormattedDate2();

  console.log("Ajaja", dataUser);
  return (
    <div className="containerChat-list">
      <h1>Chats</h1>
      <div className="message-chat">
        <ChatList onSelectUser={handleUserSelect} />
        {isChatVisible && selectedUser ? (
          <div className="chat-container">
            <div className="chat-header">
              <div className="header-info">
                <button className="add" onClick={handleBackButtonClick}>
                  <IoIosArrowBack />
                </button>
                <div className="avatar">
                  <Link
                    to={
                      dataUser.user_type === "Amigo"
                        ? `/profileClient/${selectedUser.client_id}`
                        : `/profileFriend/${selectedUser.id_user}`
                    }
                  >
                    <img
                      className="avatar-chat"
                      src={`data:image/png;base64,${selectedUser.image}`}
                      alt={selectedUser.name}
                    />
                  </Link>
                </div>
                <div className="user-info">
                  <h3>
                    {selectedUser.nombre_cliente} {selectedUser.first_name}{" "}
                    {selectedUser.last_name}
                  </h3>
                  <p>Última vez activo: {timeSinceLastMessage}</p>
                </div>
              </div>
            </div>
            {Object.keys(groupedMessages).length === 0 ? (
              <div className="chat-placeholder-one">
                {/* <img
                  src="https://i.ibb.co/hZwZSSN/Logo-frent.png"
                  alt="Logo FREnt"
                  className="login-logo-chat"
                /> */}
                <h3>No tienes ninguna aun una conversación</h3>
                <p>Empieza a hablar con para cordinar una cita</p>
              </div>
            ) : (
              <div className="chat-body">
                <div className="chat-messages">
                  {Object.keys(groupedMessages).map((dateLabel, index) => (
                    <div className="chat-messages" key={index}>
                      <span className="date-chat">{dateLabel}</span>
                      {groupedMessages[dateLabel].map((message, index) => (
                        <div
                          key={index}
                          className={`message ${
                            message.sender === dataUser.user_id
                              ? "outgoing"
                              : "incoming"
                          }`}
                        >
                          <div className="message-content">
                            <div className="message-text">
                              {message.message}
                            </div>

                            {/* <span className="message-time">{formatMessageTime(message.date)}</span> */}
                            <span className="message-time">
                              {formatMessageTime(message.date)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="chat-input">
              <form className="new-message" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={handleChangeMessage}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                />
                <div className="char-counter-container">
                  <span className="char-counter">
                    {messageLength}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <button
                  className={
                    isMessageEmpty ? "submit-button disabled" : "submit-button"
                  }
                  type="submit"
                  disabled={isMessageEmpty}
                >
                  <i className="fa fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="chat-placeholder">
            <img
              src="https://i.ibb.co/hZwZSSN/Logo-frent.png"
              alt="Logo FREnt"
              className="login-logo-chat"
            />
            <h3>Inicia un chat con los amigos de FRent</h3>

            <p>Envía o recibe mensajes</p>
            <p>
              Selecciona un amigo de la lista y comienza la conversación para
              coordinar un encuentro
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
