import React from "react";
import "./buttonPersonal.css";

export function ButtonPersonal ({onClick, label, type}) {
    return(
        <div className="personal-button">
            <button onClick={onClick} type={type}>
                {label}
            </button>
        </div>
    );
}
