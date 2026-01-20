import React from "react";
import "./buttonPrimary.css";

export function ButtonPrimary ({onClick, label, type}) {
    return(
        <div className="primary-button">
            <button onClick={onClick} type={type}>
                {label}
            </button>
        </div>
    );
}

