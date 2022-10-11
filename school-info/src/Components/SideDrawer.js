import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { faBasketball } from "@fortawesome/free-solid-svg-icons";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../ComponentsCSS/SideDrawer.css";

let activeStyle = {
  backgroundColor: "#98dede",
  borderRadius: "5px",
  borderBottom: "3px solid #aa4344",
  padding: "0 5px 0 5px",
};

function SideDrawer(props) {
  const [expandDrawer, setExpandDrawer] = useState(false);
  const level = props.level;
  var link;
  var cutOffNeeded;
  if (level === "Primary") {
    link = "/schools/primary";
    cutOffNeeded = false;
  } else if (level === "Secondary") {
    link = "/schools/secondary";
    cutOffNeeded = true;
  } else if (level === "Tertiary") {
    link = "/schools/tertiary";
    cutOffNeeded = true;
  }

  return (
    <div>
      {expandDrawer ? (
        <div className="side-drawer">
          <div className="contents-container">
            <li className="side-drawer-list general">
              <FontAwesomeIcon
                icon={faGear}
                className="inline-drawer drawer-icons"
              />
              <NavLink
                className="side-drawer-link"
                to={link.concat("/general")}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                General
              </NavLink>
            </li>

            {cutOffNeeded ? (
              <li className="side-drawer-list">
                <FontAwesomeIcon
                  icon={faSquarePollVertical}
                  className="inline-drawer drawer-icons"
                />
                <NavLink
                  className="side-drawer-link"
                  to={link.concat("/cut-off-points")}
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  Cut-off Points
                </NavLink>
              </li>
            ) : (
              <></>
            )}

            <li className="side-drawer-list">
              <FontAwesomeIcon
                icon={faBook}
                className="inline-drawer drawer-icons"
              />
              <NavLink
                className="side-drawer-link"
                to={link.concat("/subjects-offered")}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Subjects Offered
              </NavLink>
            </li>

            <li className="side-drawer-list">
              <FontAwesomeIcon
                icon={faBasketball}
                className="inline-drawer drawer-icons"
              />
              <NavLink
                className="side-drawer-link"
                to={link.concat("/ccas")}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                CCAs
              </NavLink>
            </li>

            <li className="side-drawer-list">
              <FontAwesomeIcon
                icon={faPalette}
                className="inline-drawer drawer-icons"
              />
              <NavLink
                className="side-drawer-link"
                to={link.concat("/electives&programmes")}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Electives & Programmes
              </NavLink>
            </li>

            <FontAwesomeIcon
              icon={faCircleChevronLeft}
              className="chevron-left"
              onClick={() => setExpandDrawer(false)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="chevron-right-container">
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="chevron-right"
              onClick={() => setExpandDrawer(true)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SideDrawer;
