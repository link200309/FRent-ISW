import React from "react";
import "./InputText.css";


function InputText({ label,
    id,
    type,
    placeholder,
    value,
    onChange,
    errors,
    register,
    required,
    maxLength }) {
    return (
        <div className="input-component">
            <label htmlFor={id} >
                {label}
                {required && <span className="required">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                id={id}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                {...register}
            />
            {errors && errors[id] && <span className="error-message">{errors[id].message}</span>}
        </div>
    );
}

export default InputText;