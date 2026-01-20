import { useForm } from "react-hook-form";
import { ButtonPrimary } from "../../Buttons/buttonPrimary";
import { ButtonSecondary } from "../../Buttons/buttonSecondary";
import InputText from "../Inputs/InputText";
import SelectOptions from "../Selects/selectOptions";
import { useState, useEffect } from "react";
import { Country, State } from "country-state-city";

import "./customerForm.css";
import InterestModal from "../Interests/interestSection";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export function CustomerForm() {
  const navigate = useNavigate();
  const location = useLocation();
  let userData = location.state;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorLike, setErrorLike] = useState("");

  //SE LO DEBE USAR EN LA PARTE DEL REGISTRO

  useEffect(() => {
    if (userData) {
      let countries = Country.getAllCountries();
      countries = countries.filter(
        (country) => country.name === userData.country
      );
      const states = State.getStatesOfCountry(countries[0].isoCode);
      setStates(states);
      setValue("First_name", userData.first_name);
      setValue("Last_name", userData.last_name);
      setValue("birth_date", userData.birth_date);
      setSelectedGender(userData.gender);
      setValue("Gender", userData.gender);
      setSelectedCountry(userData.country);
      setValue("Country", userData.country);
      setSelectedState(userData.city);
      setValue("City", userData.city);
      setValue("Email", userData.email);
      setValue("Password", userData.password);
      setValue("confirmarPassword", userData.password);
      setValue("Personal_description", userData.personal_description);
    }
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (selectedInterests.length < 2) {
      setErrorMessage("Debe seleccionar al menos 2 intereses.");
      return;
    }

    navigate("/photo", {
      state: {
        city: data.City,
        country: data.Country,
        email: data.Email,
        first_name: data.First_name,
        gender: data.Gender,
        last_name: data.Last_name,
        password: data.Password,
        personal_description: data.Personal_description,
        birth_date: data.birth_date,
        likes: selectedInterests,
        is_client: true,
        image: userData ? userData.image : null,
      },
    });
  });

  const optionsGender = [
    { value: "femenino", label: "Femenino" },
    { value: "masculino", label: "Masculino" },
    { value: "noIndicado", label: "Prefiero no decirlo" },
  ];

  const handleSaveInterests = (selectedInterests) => {
    if (selectedInterests.length < 2) {
      setErrorLike("Debe seleccionar al menos 2 intereses.");
    } else {
      setErrorLike(""); // Limpiar el mensaje de error si la validación pasa
    }
    setSelectedInterests(selectedInterests);
  };

  const handleCountryChange = (e) => {
    const selectedCountryIsoCode = e.target.value;
    let countries = Country.getAllCountries();

    setSelectedCountry(selectedCountryIsoCode);
    countries = countries.filter(
      (country) => country.name === selectedCountryIsoCode
    );

    const states = State.getStatesOfCountry(countries[0].isoCode);
    setStates(states);
    setSelectedState("");
  };

  const handleStateChange = (e) => {
    const selectedStateIsoCode = e.target.value;
    setSelectedState(selectedStateIsoCode);
  };

  return (
    <div className="body-page">
      <div className="form-body-container">
        <h3>Datos personales del cliente</h3>
        <form action="" id="formulario-cliente" onSubmit={onSubmit}>
          <div className="colums-inputs">
            <div className="input-2c">
              <InputText
                id={"First_name"}
                label={"Nombre(s)"}
                type={"text"}
                required={true}
                placeholder={"Ingrese su(s) nombre(s)"}
                register={register("First_name", {
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  pattern: {
                    value:
                      /^[a-zA-ZáéíóúÁÉÍÓÚüñÑ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚüñÑ]+)*$/,
                    message:
                      "El nombre solo puede contener letras y caracteres españoles",
                  },
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "Demasiados caracteres",
                  },
                })}
                errors={errors}
              />
            </div>
            <div className="input-2c">
              <InputText
                id={"Last_name"}
                label={"Apellido(s)"}
                type={"text"}
                required={true}
                placeholder={"Ingrese su(s) apellido(s)"}
                register={register("Last_name", {
                  required: {
                    value: true,
                    message: "El apellido es requerido",
                  },
                  pattern: {
                    value:
                      /^[a-zA-ZáéíóúÁÉÍÓÚüñÑ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚüñÑ]+)*$/,
                    message:
                      "El apellido solo puede contener letras y caracteres españoles",
                  },
                  minLength: {
                    value: 2,
                    message: "El apellido debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "Demasiados caracteres",
                  },
                })}
                errors={errors}
              />
            </div>
            <div className="input-1c">
              <InputText
                id={"birth_date"}
                label={"Fecha de nacimiento"}
                type={"date"}
                required={true}
                placeholder={"DD/MM/AA"}
                register={register("birth_date", {
                  required: {
                    value: true,
                    message: "Fecha de nacimiento requerida",
                  },
                  validate: (value) => {
                    const fechaNacimiento = new Date(value);
                    const fechaActual = new Date();
                    const edad =
                      fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                    if (edad < 18) {
                      return "Debe ser mayor de edad";
                    } else if (edad > 100) {
                      return "Debe ser menor de 100 años";
                    } else {
                      return true;
                    }
                  },
                })}
                errors={errors}
              />
            </div>
            <div className="input-1c">
              <SelectOptions
                id={"Gender"}
                label={"Género"}
                name={"genero"}
                placeholder={"Elija su género"}
                value={selectedGender}
                required={true}
                options={optionsGender}
                register={register("Gender", {
                  required: {
                    value: true,
                    message: "Campo requerido",
                  },
                })}
                errors={errors}
                onChange={(e) => setSelectedGender(e.target.value)}
              />
            </div>
            <div className="input-1c">
              <SelectOptions
                className="pais-select"
                id={"Country"}
                label={"País"}
                name={"pais"}
                placeholder={"Elija un país"}
                value={selectedCountry}
                required={true}
                onChange={handleCountryChange} // Manejador de cambio de selección
                options={Country.getAllCountries().map((country) => ({
                  value: country.name,
                  label: country.name,
                }))}
                register={register("Country", {
                  required: {
                    value: true,
                    message: "Campo requerido",
                  },
                })}
                errors={errors}
              />
            </div>
            <div className="input-1c">
              <SelectOptions
                id={"City"}
                label={"Ciudad"}
                name={"ciudad"}
                placeholder={"Elija una ciudad"}
                value={selectedState}
                required={true}
                onChange={handleStateChange}
                options={states.map((state) => ({
                  value: state.name && state.name.replace(" Department", ""),
                  label: state.name && state.name.replace(" Department", ""),
                }))}
                register={register("City", {
                  required: {
                    value: true,
                    message: "Campo requerido",
                  },
                })}
                errors={errors}
                disabled={!selectedCountry}
              />
            </div>
            <div className="input-4c">
              <InputText
                id={"Email"}
                label={"Correo electrónico"}
                type={"email"}
                required={true}
                placeholder={"Ingrese su correo electrónico"}
                register={register("Email", {
                  required: {
                    value: true,
                    message: "El Correo es requerido",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                    message: "Formato de email invalido",
                  },
                })}
                errors={errors}
              />
            </div>
            <div className="input-2c">
              <InputText
                id={"Password"}
                label={"Contraseña"}
                type={"password"}
                required={true}
                placeholder={"Ingrese su contraseña"}
                register={register("Password", {
                  required: {
                    value: true,
                    message: "La contraseña es requerida",
                  },
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message:
                      "La contraseña debe contener al menos una letra y un número",
                  },
                })}
                errors={errors}
              />
            </div>

            <div className="input-2c">
              <InputText
                id={"confirmarPassword"}
                label={"Confirmar contraseña"}
                type={"password"}
                required={true}
                placeholder={"Repita su contraseña"}
                register={register("confirmarPassword", {
                  required: {
                    value: true,
                    message: "La confirmación de la contraseña es requerida",
                  },
                  validate: (value) => {
                    if (value === watch("Password")) {
                      return true;
                    } else {
                      return "Las contraseñas no coinciden";
                    }
                  },
                })}
                errors={errors}
              />
            </div>
            <div className="input-4c descripction">
              <label htmlFor="descripcion">Descripción personal</label>
              <textarea
                placeholder="Cuentanos sobre ti"
                name="descripcion"
                className="textAreaDescription"
                {...register("Personal_description", {
                  maxLength: {
                    value: 150,
                    message: "Excedió el número máximo de caracteres (150)",
                  },
                })}
              ></textarea>
              {errors.Personal_description && (
                <span className="error-message">
                  {errors.Personal_description.message}
                </span>
              )}
            </div>

            <div className="input-4c">
              <InterestModal
                onSaveInterests={handleSaveInterests}
                errors={errors}
                userDataLikes={userData ? userData.likes : []}
              />
              <div className="error-message">{errorLike}</div>
            </div>
          </div>
          <div className="buttons-section">
            <NavLink to="/">
              <ButtonSecondary label={"Cancelar"} />
            </NavLink>
            <ButtonPrimary type={"submit"} label={"Siguiente"} />
          </div>
        </form>
      </div>
    </div>
  );
}
