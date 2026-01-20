import React, { useEffect, useState } from "react";
import "./AvailabilityModal.css";
import { getAvailabilityFriend } from "../../../../../api/register.api";

const AvailabilityModal = ({ onClose, friendId }) => {
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resAvailability = await getAvailabilityFriend(friendId);
        setAvailability(
          Array.isArray(resAvailability.data) ? resAvailability.data : []
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchData();
  }, [friendId]);

  const obtenerRangos = (dia) => {
    const rango = availability.find(
      (informacionDia) => informacionDia.dia_semana === dia
    );

    if (rango) {
      return `${rango.start} a ${rango.end}`;
    } else {
      return "No disponible";
    }
  };

  return (
    <div className="modalBackground">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>X</button>

        <div className="availability-profile">
          <h2>Disponibilidades: </h2>
        <button className="closeButton" onClick={onClose}>X</button>

          <div className="colums-availability-profile">
            <div className="input-1c-profile">
              <p className="label-information">Lunes:</p>
              <p>{obtenerRangos("Lunes")}</p>
            </div>
            <div className="input-2c-profile">
              <p className="label-information">Martes:</p>
              <p>{obtenerRangos("Martes")}</p>
            </div>
            <div className="input-3c-profile">
              <p className="label-information">Miércoles:</p>
              <p>{obtenerRangos("Miércoles")}</p>
            </div>
            <div className="input-1c-profile">
              <p className="label-information">Jueves:</p>
              <p>{obtenerRangos("Jueves")}</p>
            </div>
            <div className="input-2c-profile">
              <p className="label-information">Viernes:</p>
              <p>{obtenerRangos("Viernes")}</p>
            </div>
            <div className="input-3c-profile">
              <p className="label-information">Sábado:</p>
              <p>{obtenerRangos("Sábado")}</p>
            </div>
            <div className="input-1c-profile">
              <p className="label-information">Domingo:</p>
              <p>{obtenerRangos("Domingo")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
