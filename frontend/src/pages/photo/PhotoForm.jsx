import React, { useState, useEffect } from "react";
import "./PhotoFrom.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonSecondary } from "../../components/Buttons/buttonSecondary";
import { ButtonPrimary } from "../../components/Buttons/buttonPrimary";
import { createRegisterClient } from "../../api/register.api";
import { createLikes } from "../../api/register.api";
import swal from "sweetalert";/* 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import upload from "../../lib/upload"; */



const Photo = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [backupPhotos, setBackupPhotos] = useState([]);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBinary, setImageBinary] = useState("");
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const location = useLocation();
  const userData = location.state;

  useEffect(() => {
    if (userData.image) {
      setFile(userData.file);
      setPreviewUrl(`data:image/jpeg;base64,${userData.image}`);
    }
  }, []);

  const backPage = () => {

    const userDataDatas = {
      city: userData.city,
      country: userData.country,
      email: userData.email,
      first_name: userData.first_name,
      gender: userData.gender,
      last_name: userData.last_name,
      password: userData.password,
      confirmPassword: userData.confirmarPassword,
      personal_description: userData.personal_description,
      birth_date: userData.birth_date,
      price: userData.price,
      likes: userData.likes,
      image: imageBinary ? imageBinary : userData ? userData.image : null,
    }

    console.log("la ciudad es: ", userData.city);

    if (userData.is_client) {
      navigate("/customer", {
        state: userDataDatas,
      });

    } else {
      navigate("/friend", {
        state: userDataDatas,
      });
    }
  };

  const translateErrorMessage = (errorMessage) => {
    const errorTranslations = {
      "user with this email already exists.":
        "Ya existe un usuario con este correo electrónico.",
    };
    return errorTranslations[errorMessage] || errorMessage;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileURL = URL.createObjectURL(selectedFile);
    if (!selectedFile) return;
    const fileSize = selectedFile.size / 1024 / 1024;
    const fileType = selectedFile.type;
    if (fileSize > 50) {
      setError("El archivo excede el tamaño máximo permitido (50 MB)");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(fileType)) {
      setError(
        "Formato de archivo no válido. Solo se permiten archivos JPEG, PNG y WEBP."
      );
      return;
    }
    /* setAvatar({
      file: selectedFile,
      url: fileURL,
    }); */

    setFile(selectedFile);
    setError(""); // Reset error message
    setPreviewUrl(URL.createObjectURL(selectedFile));
    convertImageToBinary(selectedFile);
  };

  const convertImageToBinary = (imageFile) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(imageFile);
    reader.onload = () => {
      const base64String = arrayBufferToBase64(reader.result);
      setImageBinary(base64String);
    };
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const nextPage = async () => {
    if (!file && !userData.image) {
      swal("Foto requerida", "Debe seleccionar un foto de perfil");
      return;
    }


    if (userData.is_client) {
      const client = {
        city: userData.city,
        country: userData.country,
        email: userData.email,
        first_name: userData.first_name,
        gender: userData.gender,
        last_name: userData.last_name,
        password: userData.password,
        confirmPassword: userData.confirmarPassword,
        personal_description: userData.personal_description,
        birth_date: userData.birth_date,
        image: imageBinary ? imageBinary : userData.image,
        is_client: userData.is_client,
      };

      /* const email = userData.email;
      const password = userData.password;
      const first_name = userData.first_name;
      const last_name = userData.last_name;
      const imagen1 = userData.image; */
      try {

        /* const res = await createUserWithEmailAndPassword(auth, email, password);
        const imgUrl = await upload(avatar.file);

        await setDoc(doc(db, "users", res.user.uid), {
          first_name,
          last_name,
          email,
          avatar: imgUrl,
          id: res.user.uid,
          blocked: [],
        });

        await setDoc(doc(db, "userchat", res.user.uid), {
          chats: [],
        }); */
        const resFriend = await createRegisterClient(client);

        //PETICION PARA REGISTRAR GUSTOS
        const user_likes = {
          likes: userData.likes,
          user_id: resFriend.data.id_user,
        };

        await createLikes(user_likes);
        swal(
          "Registro exitoso",
          "El cliente se registró correctamente",
          "success"
        );
        setTimeout(() => {
          swal.close();
        }, 1000);

        navigate("/login");
      } catch (error) {
        console.error("Error al enviar los datos:", error);
        if (error.response && error.response.data && error.response.data.email) {
          const translatedErrorMessage = translateErrorMessage(
            error.response.data.email[0]
          );
          swal("" + translatedErrorMessage);
        }
      }

    } else {
      const friendDataNew = {
        ...userData,
        image: imageBinary ? imageBinary : userData.image,
      };
      navigate("/addAvailableHours", { state: { friendDataNew } });
    }
  };

  const handleRemoveFile = () => {
    delete userData.file;
    delete userData.image;
    setFile(null);
    setPreviewUrl(null);
    setImageBinary("");
    localStorage.removeItem("imageData");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  };

  return (
    <div
      className="photo-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ border: "2px dashed #ccc", padding: "20px" }}
    >
      <h2>Agregar Fotografías</h2>
      <div className="upload-box">
        <i className="fa fa-upload"></i>
        <p>Elija un archivo o arrástrelo y suéltelo aquí</p>
        <p>Formato JPG, PNG, WEBP, hasta 50 MB</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="file-input" className="upload-button">
          Buscar Archivo
          <input
            id="file-input"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            className="file-input"
            style={{ display: "none" }}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
      </div>
      {previewUrl && (
        <div className="preview-box">
          <button onClick={handleRemoveFile} className="remove-button">
            <i className="fas fa-times"></i>
          </button>
          <img src={previewUrl} alt="Vista previa" className="preview-image" />
        </div>
      )}
      <div className="button-section">
        <ButtonSecondary onClick={backPage} label={"Atras"} />
        <ButtonPrimary
          onClick={nextPage}
          label={userData.is_client ? "Registrar" : "Siguiente"}
          disabled={!file || !userData.image}
        />
      </div>
    </div>
  );
};

export default Photo;
