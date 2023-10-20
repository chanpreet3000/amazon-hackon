import React from "react";
import "./styles.css";

const InputField = (props) => {
  return (
    <div style={props.style}>
      {props.label && (
        <label className="input-field__label" htmlFor={props.id}>
          {props.label}
        </label>
      )}
      <input
        {...props}
        className="input-field__input"
        type={props.type}
        placeholder={props.placeholder}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
export default InputField;
