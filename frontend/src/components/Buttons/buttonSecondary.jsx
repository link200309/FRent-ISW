import React from "react";
import "./buttonSecondary.css";

export function ButtonSecondary ({onClick, label, type}) {
    return(
        <div className="secondary-button">
            <button onClick={onClick} type={type}>
                {label}
            </button>
        </div>
    );
}

