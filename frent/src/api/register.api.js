import axios from 'axios'

// const isProduction = process.env.NODE_ENV === "production";

let baseURL = "http://localhost:8000";
// let baseURL = "https://deploy-is-production.up.railway.app";

// if (isProduction) {
//   baseURL = "https://deploy-is-production.up.railway.app";
// }

const registersApi = axios.create({
  baseURL: baseURL,
  responseType: 'json',
  withCredentials: true
});



export const getAllRegister = () => registersApi.get('/')

export const getRegister = (id) => registersApi.get(/${id}/)

export const createRegisterClient = (data) => registersApi.post('/users/api/v1/clients/', data)

export const createRegisterRent = (data) => registersApi.post('/rents/rents/', data)

export const createRegisterFriend = (data) => registersApi.post('/users/api/v1/friends/', data)

export const getFriends = (data) => registersApi.get('/users/api/v1/friends/')

export const getClient = (data) => registersApi.get('/users/api/v1/clients/')

export const createLikes = (data) => registersApi.post('/users/api/v1/user_tastes/', data)

export const createAvailability = (data) => registersApi.post('/users/api/v1/availability/', data)

export const getAvailabilityFriend = (id) => registersApi.get(`/users/api/v1/availability/${id}/get_availability_user/`)

export const deleteRegister = (id) => registersApi.delete(/${id}/)

export const updateRegister = (id, date) => registersApi.put(/${id}/, date)

export const getLikes = () => registersApi.get('/users/api/v1/likes/')

export const getOutfit = () => registersApi.get('/rents/outfits/')

export const getEvent = () => registersApi.get('/rents/events/')

export const getRent = () => registersApi.get('/rents/rents/')

/* export const getPendingRent = (id) =>  registersApi.get(`/rents/rents/${id}/get_pendings_rents/`) */

export const update_pending_rent = (id, data) =>  registersApi.patch(`/rents/rents/${id}/`, data)

export const deleteRent = (id) => registersApi.delete(`/rents/rents/${id}/`)

export const getPrice = () => registersApi.get("/rents/price/")

export const get_likes_user = (id) => registersApi.post('/users/api/v1/user_tastes/get_likes_user/', id)

export const createNotication = (data) => registersApi.post('/notificaciones/send-email/', data);

export const getClientID = (id) => registersApi.get(`/users/api/v1/clients/${id}/`)

export const getFriendID = (id) => registersApi.get(`/users/api/v1/friends/${id}/`)

export const getFriendID2 = (id) => registersApi.get(`/users/friends/detail/${id}/` )

export const create_notification = (id) => registersApi.post('/notificacionesInterno/notiIn/', id)

export const get_notifications_user = (id) => registersApi.get(`/notificacionesInterno/notiIn/${id}/`)

export const update_notifications_user = (id) => registersApi.patch(`/notificacionesInterno/notiIn/${id}/`)

export const delete_notifications_user = (id) => registersApi.delete(`/notificacionesInterno/notiIn/${id}/`)

export const validarLogin = (data) => registersApi.post('/users/login/', data)

export const obtenerHorariosReservas = (id) => registersApi.get(`/rents/friend-calendar/${id}/`)

export const getPendingRent = (id) => registersApi.get(`/rents/rent_detail/${id}/`)

export const get_acepted_friends = (id) => registersApi.get(`/rents/accepted_rents/${id}/`)

export const save_comment = (commentData) => registersApi.post('rents/save_comment/', commentData);

export const get_friend_comments = (friendId) => registersApi.get(`rents/get_friend_comments/${friendId}/`);


export const getMessagesUser = (data) => registersApi.post(`/chat/api/v1/canal/get_chats_user/`, data)

export const likes_friend_post = (friendId, like) => registersApi.post(`/users/likes_friend/${friendId}/`, { like });

export const getMessagesLast = (data) => registersApi.post(`/chat/api/v1/canal/get_message/`, data)



/* export const getTime = (id) => registersApi.get(`/rents/time_elapsed/${id}/`) */