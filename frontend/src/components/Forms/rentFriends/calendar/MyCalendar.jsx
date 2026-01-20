import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import { NavLink, useParams } from "react-router-dom";
import dayjs from "dayjs";
import EventList from "./EventList";
import { obtenerHorariosReservas } from "../../../../api/register.api";
import "dayjs/locale/es";
import "./MyCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import AvailabilityModal from "./avability/AvailabilityModal";

dayjs.locale("es");

function CalendarEdit() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const { id } = useParams();
  const friendId = parseInt(id);

  const localizer = dayjsLocalizer(dayjs, {
    messages: {
      today: "Hoy",
      back: "Atrás",
      next: "Siguiente",
    },
  });

  const dayStyleGetter = (date) => {
    const hasEvent = events.some(
      (event) =>
        dayjs(event.start).isSame(date, "day") ||
        dayjs(event.end).isSame(date, "day")
    );
    return hasEvent
      ? {
          style: {
            backgroundColor: "#333A73",
            borderRadius: "10px",
            border: "1px solid #000",
          },
        }
      : {};
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const res = await obtenerHorariosReservas(friendId);
      if (Array.isArray(res.data)) {
        const eventosTransformados = res.data.map((evento) => ({
          start: dayjs(
            evento.fecha_alquiler + "T" + evento.hora_inicio
          ).toDate(),
          end: dayjs(evento.fecha_alquiler + "T" + evento.hora_fin).toDate(),
          title: `Ocupado`,
          duration: `${evento.duration} horas`,
        }));
        setEvents(eventosTransformados);
      }
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  const calendarStyle = {
    height: 630, // Aumenta la altura del calendario
    width: '130%', // Aumenta el ancho del calendario
    backgroundColor: "#fff",
  };

  const handleAddEvent = (date) => {
    setSelectedDate(dayjs(date));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setModalOpen(false);
  };

  const handleShowAvailability = () => {
    setAvailabilityModalOpen(true);
  };

  const handleCloseAvailabilityModal = () => {
    setAvailabilityModalOpen(false);
  };

  return (
    <>
      <div className="botones-calendario">
        <NavLink className="boton-calendar" to={`/profileFriend/${friendId}`}>
          <IoArrowBackCircleSharp />
        </NavLink>
        <button onClick={handleShowAvailability}>Mostrar Disponibilidad</button>
      </div>
      <div className="calendar">
        <div className="calendarList">
          <Calendar
            messages={{
              next: "Mes siguiente",
              previous: "Mes anterior",
              today: "Este mes",
            }}
            localizer={localizer}
            events={events}
            views={["month"]}
            toolbar={true}
            style={calendarStyle}
            components={{
              event: ({ event }) => (
                <button
                  onClick={() => handleAddEvent(event.start)}
                  style={{
                    backgroundColor: "#3174ad",
                    borderRadius: "5px",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    height: "30px",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#3174ad",
                      borderRadius: "5px",
                      color: "#fff",
                      cursor: "pointer",
                      border: "none",
                      width: "100%",
                      height: "30px",
                      textAlign: "left",
                      padding: "0",
                    }}
                  >
                    {event.title}
                  </div>
                </button>
              ),
            }}
            dayPropGetter={dayStyleGetter}
            selectable={true}
            onSelectSlot={(slotInfo) => handleAddEvent(slotInfo.start)}
          />
          {modalOpen && selectedDate && (
            <div className="modalBackground">
              <EventList
                date={selectedDate}
                events={events}
                onCloseModal={handleCloseModal}
              />
            </div>
          )}
          {availabilityModalOpen && (
            <AvailabilityModal
              friendId={friendId}
              onClose={handleCloseAvailabilityModal}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CalendarEdit;
