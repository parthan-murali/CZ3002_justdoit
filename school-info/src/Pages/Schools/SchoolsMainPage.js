import React from "react";
import { Link } from "react-router-dom";

import "../../PagesCSS/Schools/SchoolsMainPage.css";

function SchoolsMainPage() {
  return (
    <div className="schools-main-container">
      <p className="schools-main-title">Select an education level!</p>

      {/* Primary */}
      <li className="schools-main-list">
        <Link className="schools-main-items primary" to="/schools/primary">
          Primary
        </Link>
      </li>
      {/* Secondary */}
      <li className="schools-main-list">
        <Link className="schools-main-items secondary" to="/schools/secondary">
          Secondary
        </Link>
      </li>
      {/* Tertiary */}
      <li className="schools-main-list">
        <Link className="schools-main-items tertiary" to="/schools/tertiary">
          Tertiary
        </Link>
      </li>
    </div>
  );
}

export default SchoolsMainPage;
