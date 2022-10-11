import React, { useState } from "react";
import "../ComponentsCSS/Modal.css";

function Modal(props) {
  const [modalPassword, setModalPassword] = useState("");
  return (
    <>
      <div
        className="modal-darkBG"
        onClick={() => {
          props.setToDelete(false);
          props.setOpenModal(false);
        }}
      />
      <div className="modal-centered">
        <div className="modal-main">
          <div className="modal-header">
            <h3>Reauthentication</h3>
          </div>
          <p className="modal-content">Please enter your password.</p>
          <input
            type="password"
            className="modal-input"
            onChange={(e) => setModalPassword(e.target.value)}
            placeholder="Password"
          ></input>
          <div>
            <button
              onClick={() => {
                props.setToDelete(false);
                props.setOpenModal(false);
              }}
              className="modal-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                props.setPassword(modalPassword);
                console.log("Password:", modalPassword);
                props.setOpenModal(false);
              }}
              className="modal-btn"
              disabled={modalPassword === ""}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
