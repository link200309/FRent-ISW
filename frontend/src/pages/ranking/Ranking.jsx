import React, { useEffect, useState } from 'react'
import TopFriends from './TopFriends';
import FriendsList from './FriendsList';
import './Ranking.css';
import { getFriends } from '../../api/register.api';



export default function Ranking (){

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const loadFriends = async () => {
            try {
              const res = await getFriends();
              console.log(res, "Lista amigos");
              setFriends(res.data);
            } catch (error) {
              console.error("Error al cargar la lista de amigos:", error);
            }
          };
          loadFriends();

        // const dummyFriends = [
        //     {   id: 1,
        //         profile_picture: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
        //         name: "Mauricio",
        //         likes: 100
        //     },
        //     {   id: 2,
        //         profile_picture: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
        //         name: "Roberto",
        //         likes: 120
        //     },
        //     {   id: 3,
        //         profile_picture: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
        //         name: "Mauricio",
        //         likes: 80
        //     },
        //     {   id: 4,
        //         profile_picture: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
        //         name: "Carla",
        //         likes: 50
        //     },
        //     {   id: 5,
        //         profile_picture: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
        //         name: "Jose Armando",
        //         likes: 60
        //     },
        //     {   id: 6,
        //         profile_picture: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
        //         name: "Romina",
        //         likes: 10
        //     }
        // ];
        // // Simular el tiempo de carga
        // setTimeout(() => {
        //     setFriends(dummyFriends);
        // }, 1000); // Simula un retraso de 1 segundo
    }, []);

    // Ordenar los amigos por puntuación de likes en orden descendente
    const sortedFriends = friends.sort((a, b) => b.like_count - a.like_count);

    // Separar los tres primeros amigos para mostrarlos en el top
    const topThreeFriends = sortedFriends.slice(0, 3);
    const remainingFriends = sortedFriends.slice(3);

    return(
        <div className='content'>
            <h2>
                Ranking de amigos
            </h2>
            <TopFriends friends={topThreeFriends}/>
            <FriendsList friends={remainingFriends}/>
        </div>
    );
}
