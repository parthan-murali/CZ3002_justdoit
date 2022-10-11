import React from "react";
import { Link } from "react-router-dom";
import "../ComponentsCSS/Dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Dropdown(props) {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState(props.currentPage);
  return (
    <div className="dropdown-container">
      <div
        className="dropdown-button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {chosen}
        <FontAwesomeIcon className="fa-chevron-down" icon={faChevronDown} />
      </div>
      {open && (
        <div className="dropdown-content">
          <li className="dropdown-item">
            <Link className="dropdown-item" to="/schools/primary" onClick={()=> setChosen("Primary")}>
              Primary
            </Link>
          </li>
          <li className="dropdown-item">
            <Link className="dropdown-item" to="/schools/secondary" onClick={()=> setChosen("Primary")}>
              Secondary
            </Link>
          </li>
          <li className="dropdown-item">
            <Link className="dropdown-item" to="/schools/tertiary" onClick={()=> setChosen("Primary")}>
              Tertiary
            </Link>
          </li>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
