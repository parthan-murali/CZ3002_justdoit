import React from "react";

/* Text error for validating forms */
function FormTextError(props) {
  return (
    <div
      className="form-error-msg"
      style={{
        color: "red",
        fontSize: "12px",
        textAlign: "left",
        paddingLeft: "20px",
        paddingTop: "5px",
      }}
    >
      {props.children}
    </div>
  );
}

export default FormTextError;
