import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCodeCompare } from "@fortawesome/free-solid-svg-icons";
import "../ComponentsCSS/SubjectsCard.css";
import "../ComponentsCSS/SchoolsCard.css";

import { useContext } from "react"; // allows us to establish connection btwn this component and the Favourites context
import FavouritesContext from "../Contexts/FavouritesContext";
import CompareContext from "../Contexts/CompareContext";

function SubjectsCard(props) {
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

  let subjects = [];

  for (let i = 0; i < props.data.subject_desc.length; i++) {
    if (i !== props.data.subject_desc.length - 1) {
      subjects.push(props.data.subject_desc[i].toLowerCase() + " ,  ");
    } else {
      subjects.push(props.data.subject_desc[i].toLowerCase());
    }
  }

  return (
    <div className="school-card subjects-card">
      <p className="school-name subjects-card-school-name">
        {props.data.school_name}
        <FontAwesomeIcon
          className={
            !itemIsFavourite ? "fa-heart-icon" : "fa-heart-icon-toggled"
          }
          icon={faHeart}
          onClick={toggleFavouriteStatusHandler}
        ></FontAwesomeIcon>
      </p>

      <div className="subjects-desc">{subjects}</div>

      {/* <div className="container">
        <label className="compare-btn-form-control">
          click to compare
          <input type="checkbox" className="compare-btn"></input>
        </label>
      </div> */}
      <p className="container">
        <FontAwesomeIcon
          className={
            !toCompare ? "compare-icon" : "compare-icon-toggled"
          }
          icon={faCodeCompare}
          onClick={toggleCompareHandler}
        ></FontAwesomeIcon>
      </p>

    </div>
  );
}

export default SubjectsCard;
