import "./ProfileUser.css";
import { getUser } from "../Login/LoginForm";
import { useEffect, useState } from "react";
import { getAvailabilityFriend } from "../../api/register.api";
import { ButtonPrimary } from "../../components/Buttons/buttonPrimary";
import { NavLink, useParams } from "react-router-dom";

export default function ProfileUser() {
  const userData = getUser();
  const { path_back } = useParams();
  const { id } = useParams();
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resAvailability = await getAvailabilityFriend(userData.user_id);
        setAvailability(
          Array.isArray(resAvailability.data) ? resAvailability.data : []
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchData();
  }, [userData.user_id]);

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

  const definePathBack = () => {
    let newPath;

    if (!path_back) {
      return "/";
    }

    if (id) {
      newPath = `/${path_back}/${id}`;
      return newPath;
    }
    return "/" + path_back;
  };

  return (
    <>
      {userData && (
        <div className="body-page-profile">
          <div className="btn-back">
            <NavLink to={definePathBack()}>
              <ButtonPrimary label={"Regresar"} />
            </NavLink>
          </div>
          <div className="shape-background">
            <svg className="shape-a-profile" width="200" height="200">
              <circle cx={100} cy={100} r={100} />
            </svg>

            <svg className="shape-b-profile" width="80" height="80">
              <circle cx={40} cy={40} r={40} />
            </svg>

            <svg className="shape-c-profile" width="500" height="500">
              <circle cx={250} cy={250} r={250} />
            </svg>
          </div>

          <div className="profile-view">
            <div className="profile-image-availability">
              <div className="profile-image">
                <img src={`data:image/png;base64,${userData.image}`} alt="" />
              </div>

              {userData.user_type === "Amigo" && (
                <div className="availability-profile">
                  <h2>Disponibilidades: </h2>
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
                      <p>{obtenerRangos("Miercoles")}</p>
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
                      <p>{obtenerRangos("Sabado")}</p>
                    </div>

                    <div className="input-1c-profile">
                      <p className="label-information">Domingo:</p>
                      <p>{obtenerRangos("Domingo")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-description">
              <div className="profile-name">
                <h2>
                  {userData.first_name} {userData.last_name}
                </h2>
              </div>

              <p>{userData.personal_description}</p>

              <h2>Intereses: </h2>

              <div className="profile-interests">
                {userData.likes &&
                  userData.likes.map((interest, index) => (
                    <span key={index} className="interest-selected">
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
                      </svg>
                      {interest}
                    </span>
                  ))}
              </div>

              <h2>Datos personales: </h2>

              <div className="profile-personal-information">
                <div className="colums-inputs-profile">
                  <div className="input-1c-profile">
                    <p className="label-information">Fecha de nacimiento:</p>
                    <p>{userData.birth_date}</p>
                  </div>
                  <div className="input-2c-profile">
                    <p className="label-information">Género :</p>
                    <p>{userData.gender}</p>
                  </div>
                  <div className="input-1c-profile">
                    <p className="label-information">País :</p>
                    <p>{userData.country}</p>
                  </div>
                  <div className="input-2c-profile">
                    <p className="label-information">Ciudad:</p>
                    <p>{userData.city}</p>
                  </div>
                  <div className="input-1c-profile">
                    <p className="label-information">Correo electrónico:</p>
                    <p>{userData.email}</p>
                  </div>

                  {userData.user_type === "Amigo" && (
                    <div className="input-2c-profile">
                      <p className="label-information">Precio:</p>
                      <p>{userData.price} Bs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
