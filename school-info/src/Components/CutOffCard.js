import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCodeCompare } from "@fortawesome/free-solid-svg-icons";
import "../ComponentsCSS/SubjectsCard.css";
import "../ComponentsCSS/CutOffCard.css";

import { useContext } from "react"; // allows us to establish connection btwn this component and the Favourites context
import FavouritesContext from "../Contexts/FavouritesContext";
import CompareContext from "../Contexts/CompareContext";

function CutOffCard(props) {
  const level = props.level;
  props.data.school_name = props.data.school_name.toLowerCase();

  const favouritesCtx = useContext(FavouritesContext);
  const itemIsFavourite = favouritesCtx.itemIsFavourite(props.data._id);

  function toggleFavouriteStatusHandler() {
    if (itemIsFavourite) {
      favouritesCtx.removeFavourite(props.data._id);
    } else {
      favouritesCtx.addFavourite(props.data);
    }
  }
  const compareCtx = useContext(CompareContext);
  const toCompare = compareCtx.itemToCompare(props.data._id);

  function toggleCompareHandler() {
    if (toCompare) {
      compareCtx.removeFromCompare(props.data._id);
    } else if (compareCtx.school.length < 2) {
      compareCtx.addToCompare(props.data);
    }
  }
  if (level === "Secondary") {
    if (
      props.data.express !== undefined &&
      props.data.express.length === 0 &&
      props.data.na !== undefined &&
      props.data.na.length === 0 &&
      props.data.nt !== undefined &&
      props.data.nt.length === 0
    ) {
      return null;
    }
    return (
      <div className="school-card cut-off-card">
        <p className="school-name">
          {props.data.school_name}
          <FontAwesomeIcon
            className={
              !itemIsFavourite ? "fa-heart-icon" : "fa-heart-icon-toggled"
            }
            icon={faHeart}
            onClick={toggleFavouriteStatusHandler}
          ></FontAwesomeIcon>
        </p>
        <div className="cut-off-container">
          <div className="cut-off-box">
            <span className="cut-off-entry">Express</span>
            <div className="cut-off-affiliation">Affiliated: </div>
            <div>{props.data.express_affiliated}</div>
            <div className="cut-off-affiliation">Non-Affiliated:</div>
            <div>{props.data.express}</div>
          </div>
          <div className="cut-off-box">
            <span className="cut-off-entry">NA</span>
            <div className="cut-off-affiliation">Affiliated:</div>
            <div>{props.data.na_affiliated}</div>
            <div className="cut-off-affiliation">Non-Affiliated:</div>
            <div>{props.data.na}</div>
          </div>

          <div className="cut-off-box">
            <span className="cut-off-entry">NT</span>
            <div className="cut-off-affiliation">Affiliated:</div>
            <div>{props.data.nt_affiliated}</div>
            <div className="cut-off-affiliation">Non-Affiliated:</div>
            <div>{props.data.nt}</div>
          </div>
        </div>

        <div className="container">
          <FontAwesomeIcon
            className={!toCompare ? "compare-icon" : "compare-icon-toggled"}
            icon={faCodeCompare}
            onClick={toggleCompareHandler}
          ></FontAwesomeIcon>
        </div>
      </div>
    );
  } else if (level === "Tertiary") {
    return (
      <div className="school-card cut-off-card">
        <p className="school-name">
          {props.data.school_name}
          <FontAwesomeIcon
            className={
              !itemIsFavourite ? "fa-heart-icon" : "fa-heart-icon-toggled"
            }
            icon={faHeart}
            onClick={toggleFavouriteStatusHandler}
          ></FontAwesomeIcon>
        </p>
        <div className="jc-cut-off-container cut-off-container">
          <div>
            <span className="cut-off-entry">Arts</span> : {props.data.arts}
          </div>
          <div>
            <span className="cut-off-entry">Science</span> :{" "}
            {props.data.science}
          </div>
        </div>
        <div className="container">
          <FontAwesomeIcon
            className={!toCompare ? "compare-icon" : "compare-icon-toggled"}
            icon={faCodeCompare}
            onClick={toggleCompareHandler}
          ></FontAwesomeIcon>
        </div>
      </div>
    );
  }
}

export default CutOffCard;
