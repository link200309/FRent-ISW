import React, { useState } from 'react';

const CommentSection = ({ comments }) => {
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentCommentIndex((prevIndex) => (prevIndex === 0 ? comments.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentCommentIndex((prevIndex) => (prevIndex === comments.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="comment-section">
      {comments.length > 0 ? (
        <div className="comment-text">
          <h4>{comments[currentCommentIndex]?.client_full_name}:</h4>
          <span>{comments[currentCommentIndex]?.comment}</span>
        </div>
      ) : (
        <div className="no-comments-message">
          <p>No hay comentarios de otros Usuarios</p>
        </div>
      )}
      {comments.length > 1 && (
        <div className="comment-navigation">
          <button
            className="comment-button"
            onClick={handlePrevClick}
          >
            Anterior
          </button>
          <button
            className="comment-button"
            onClick={handleNextClick}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
