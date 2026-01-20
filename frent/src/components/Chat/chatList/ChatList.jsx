import "./chatList.css";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import {
    getPendingRent,
    getRent,
    getFriendID,
    getMessagesLast
} from "../../../api/register.api";
import { getUser } from "../../../pages/Login/LoginForm";
import { Link } from "react-router-dom";

const ChatList = ({ onSelectUser }) => {
    const [usersClient, setUsersClient] = useState([]);
    const [friendsData, setFriendsData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const userData = getUser()
    const [searchText, setSearchText] = useState('');
    const clearSearch = () => {
        setSearchText('');
    };


    const [message2, setMessages2] = useState([]);

    const fetchData2 = async () => {
        const idOther = userData.user_type === "Amigo" ? usersClient.client_id : friendsData.id_user;
        let informacion = {};
        if (userData.user_type === "Cliente") {
            informacion = {
                sender: userData.user_id,
                receiver: idOther,
            };
        } else {
            informacion = {
                sender: idOther,
                receiver: userData.user_id,
            };
        }
        try {
            const res = await getMessagesLast(informacion);
            setMessages2(res.data);
        } catch (error) {
            console.error("Error al obtener los mensajes del usuario:", error);
        }
    };
    
    useEffect(() => {
        if (userData.user_type === "Amigo") {
            fetchData();
            fetchData2();
        } else {
            obtenerDatosAmigosAceptados();
        }
    }, []);
    
    useEffect(() => {
        if (userData.user_type === "Amigo") {
            fetchData();
        } else {
            obtenerDatosAmigosAceptados();
        }
    }, []);

    const obtenerDatosAmigosAceptados = async () => {
        try {
            const response = await getRent();
            const chatList = response.data;

            const amigosAceptados = chatList
                .filter(registro => registro.client === userData.user_id && registro.status === "accepted")
                .map(registro => registro.friend);

            const amigosDataPromises = amigosAceptados.map(async (amigoID) => {
                try {
                    const friendResponse = await getFriendID(amigoID);
                    return friendResponse.data;
                } catch (error) {
                    console.error("Error al obtener datos del amigo:", error);
                    return null;
                }
            });

            const nuevosAmigosDataArray = await Promise.all(amigosDataPromises);

            // Filtrar amigos duplicados
            const amigosDataUnicos = nuevosAmigosDataArray.filter((nuevoAmigo, index, self) =>
                index === self.findIndex((amigo) => amigo.id_user === nuevoAmigo.id_user)
            );


            setFriendsData(amigosDataUnicos);
        } catch (error) {
            console.error("Error al buscar amigos aceptados:", error);
        }
    };

    const fetchData = async () => {
        try {
            const resRent = await getPendingRent(userData.user_id);
            const usersData = resRent.data;

            // Filtrar clientes duplicados y mantener los que han sido aceptados al menos una vez
            const clientesDataUnicos = usersData.filter((nuevoCliente, index, self) =>
                index === self.findIndex((cliente) => cliente.client_id === nuevoCliente.client_id) &&
                usersData.some(cliente => cliente.client_id === nuevoCliente.client_id && cliente.status === "Aceptado")
            );

            setUsersClient(clientesDataUnicos);
            console.log("Filtrado de usuarios", clientesDataUnicos);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const filteredFriends = friendsData.filter((friend) =>
        friend &&
        (
            (friend.first_name && friend.first_name.toLowerCase().includes(searchText.toLowerCase())) ||
            (friend.last_name && friend.last_name.toLowerCase().includes(searchText.toLowerCase())) ||
            (friend.personal_description && friend.personal_description.toLowerCase().includes(searchText.toLowerCase()))
        )
    );


    const filteredUsers = usersClient.filter((user) =>
        user &&
        (user.first_name || user.nombre_cliente || user.description || user.image) &&
        //(user.status === "Aceptado") &&
        (
            (user.first_name && user.first_name.toLowerCase().includes(searchText.toLowerCase())) ||
            (user.nombre_cliente && user.nombre_cliente.toLowerCase().includes(searchText.toLowerCase()))
        )
    );

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // Al hacer clic en un usuario, lo establecemos como el usuario seleccionado
        onSelectUser(user);
    };

    const truncateMessage = (message, maxLength) => {

        if (message && message.length > maxLength) {
            return message.slice(0, maxLength) + "...";
        }
        return message || "";
    };

    return (
        <div className="chatListContainer">
            <div className="chatListSearch">
                <div className="avatar">
                    <Link to="/profileUser">
                    <img
                        className="avatar-chat"
                        src={`data:image/png;base64,${userData.image}`}
                        alt={userData.name}
                    /></Link>
                </div>
                <div className="user-info-personal">
                    <h3>
                        {userData.nombre_cliente} {userData.first_name}{" "}
                        {userData.last_name}
                    </h3>
                </div>
            </div>
            <div className="chatListSearchBar">
                <i className="fas fa-search"></i>
                <input
                    className="chatListSearchInput"
                    type="text"
                    placeholder="Buscar"
                    value={searchText}
                    onChange={handleSearchChange}
                />
                <AiOutlineClose
                    className="icon1"
                    size={16}
                    color="black"
                    onClick={clearSearch}
                    cursor={"pointer"}
                />
            </div>

            <div className="user-chatList">
                {filteredFriends.length === 0 && filteredUsers.length === 0 ? (
                    <div className="chatListPlaceholder">
                        <p>No se encontraron usuarios. ¡Acepta una solicitud de alquiler de amigos o alquila un amigo y empieza a chatear con nuevas personas! 🎉</p>
                    </div>
                ) : (
                    <>
                        {filteredFriends.map((friend) => (
                            <button
                                key={friend.id_user}
                                className={`chatListItem ${selectedUser === friend ? "selected" : ""}`} // Aplica la clase "selected" si es el usuario seleccionado
                                onClick={() => handleUserClick(friend)}
                            >
                                <img className="chatListAvatarLarge" src={`data:image/png;base64,${friend.image}`} alt="" />
                                <div className="chatListItemTexts">
                                    <span className="chatListItemName">{friend.first_name} {friend.last_name}</span>
                                    <p className="chatListItemMessage">
                                        {truncateMessage("Aceptó ser tu amigo de alquiler! Comienza a...", 45)}
                                    </p>
                                </div>
                                <div className="last-time"><span className="last-message">Hace 5 min</span></div>
                            </button>
                        ))}

                        {filteredUsers.map((user) => (
                            <button
                                key={user.rent_id}
                                className={`chatListItem ${selectedUser === user ? "selected" : ""}`} // Aplica la clase "selected" si es el usuario seleccionado
                                onClick={() => handleUserClick(user)}
                            >
                                <img className="chatListAvatarLarge" src={`data:image/png;base64,${user.image}`} alt="" />
                                <div className="chatListItemTexts">
                                    <span className="chatListItemName">{user.nombre_cliente}</span>
                                    <p className="chatListItemMessage">
                                        {truncateMessage("Aceptaste ser su amigo de alquiler! Comienza a...", 45)}
                                    </p>
                                </div>
                                <div className="last-time"><span className="last-message">Hace 5 min</span></div>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatList;