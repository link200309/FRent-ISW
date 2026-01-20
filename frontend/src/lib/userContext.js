// userContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Importa la instancia de autenticación de Firebase

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Suscribirse a cambios en el estado de autenticación
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        // Limpiar la suscripción al desmontarse
        return unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{ currentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useCurrentUser = () => {
    const { currentUser } = React.useContext(UserContext);
    return currentUser;
};