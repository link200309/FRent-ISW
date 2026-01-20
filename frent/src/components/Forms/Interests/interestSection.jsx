import React, { useState, useEffect } from "react";
import "./interestSection.css";
import { getLikes } from "../../../api/register.api";

const InterestModal = ({ onSaveInterests, userDataLikes }) => {
  const [interests, setInterests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [likes, setLikes] = useState([]);
  const [idLikes, setIdLikes] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    async function loadInterests() {
      try {
        const res = await getLikes();
        setLikes(res.data);
      } catch (error) {
        console.error("Error al cargar los intereses:", error);
      }
    }
    loadInterests();
  }, []);

  useEffect(() => {
    function loadInterestsUserData() {
      let likesBack = [];
      for (let idLike of userDataLikes) {
        let likeBack = likes.filter((like) => like.id === idLike);
        likesBack.push(likeBack[0].name);
      }
      setWarningMessage("");
      setIdLikes([...userDataLikes]);
      setInterests([...likesBack]);
      onSaveInterests(idLikes);
    }
    if (likes.length > 0 && userDataLikes.length > 0) loadInterestsUserData();
  }, [likes]);

  useEffect(() => {
    function saveInterests() {
      onSaveInterests(idLikes);
    }
    if (likes.length > 0) saveInterests();
  }, [idLikes]);

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
    setWarningMessage(""); // Limpiar el mensaje de advertencia al quitar un interés
    const interestIndex = likes.filter(
      (like) => like.name === interestToRemove
    );
    let newIdLikes = idLikes.filter((idLike) => idLike !== interestIndex[0].id);
    setIdLikes(newIdLikes);
  };

  const handleInterestSelect = (interest) => {
    const interestIndex = interests.findIndex((item) => item === interest.name);
    if (interestIndex === -1) {
      if (interests.length < 10) {
        setInterests([...interests, interest.name]);
        setIdLikes([...idLikes, interest.id]);
      } else {
        setWarningMessage("No puedes seleccionar más de 10 intereses.");
      }
    } else {
      const updatedInterests = [...interests];
      updatedInterests.splice(interestIndex, 1);
      setInterests(updatedInterests);

      const updatedIdLikes = [...idLikes];
      updatedIdLikes.splice(interestIndex, 1);
      setIdLikes(updatedIdLikes);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveInterests = () => {
    onSaveInterests(idLikes);
    handleCloseModal();
    setWarningMessage(""); // Limpiar el mensaje de advertencia después de guardar
  };

  return (
    <>
      <div className="interest-body">
        <div className="interest">
          <div className="col1">
            <label htmlFor="newInterest">Gustos e Intereses{<span className="required">*</span>}</label>
          </div>
          <div className="col2">
            <button
              className="addInterest"
              onClick={(e) => {
                e.preventDefault();
                handleShowModal();
              }}
            >
              Agregar intereses
            </button>
            <ul className="tags-grid">
              {interests.map((interest, index) => (
                <li className="customerInteres" key={index}>
                  <svg
                    className="tag-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42"
                    />
                  </svg>
                  {interest}
                  <button
                    className="delete-tag-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveInterest(interest);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="titleI">Seleccione Intereses</h3>
            <div className="modal-content">
              <ul className="tags-grid">
                {likes.map((like, index) => (
                  <li
                    className={`customerInteres ${
                      idLikes.includes(like.id) ? "selected-interest" : ""
                    }`}
                    key={index}
                    onClick={() => handleInterestSelect(like)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42"
                      />
                    </svg>
                    {like.name}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="saveInterest"
              onClick={(e) => {
                e.preventDefault();
                handleSaveInterests();
              }}
            >
              Guardar
            </button>
            <div className="col2I">
              {warningMessage && (
                <span className="warning-message">{warningMessage}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(InterestModal);
