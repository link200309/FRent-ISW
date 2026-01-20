import React from "react";

const InterestModal = ({ isOpen, interests, selectedInterests, onClose, onSave }) => {
  return (
    <div className={`interest-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2>Selecciona tus intereses</h2>
        <div className="interest-list">
          {interests.map((interest) => (
            <label key={interest.id}>
              <input
                type="checkbox"
                value={interest.name}
                checked={selectedInterests.includes(interest.name)}
                onChange={(e) => onSave(interest.name, e.target.checked)}
              />
              {interest.name}
            </label>
          ))}
        </div>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default InterestModal;
