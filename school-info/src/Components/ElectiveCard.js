import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCodeCompare } from "@fortawesome/free-solid-svg-icons";
import "../ComponentsCSS/ElectiveCard.css";

import { useContext } from "react"; // allows us to establish connection btwn this component and the Favourites context
import FavouritesContext from "../Contexts/FavouritesContext";
import CompareContext from "../Contexts/CompareContext";

function ElectiveCard(props) {
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

  let moe_programme_boolean = false;
  let alp_domain_boolean = false;
  let llp_domain1_boolean = false;
  let llp_domain2_boolean = false;

  let moe_programme = [];

  /* To add commas because MOE programme length > 0*/
  if (
    props.data.moe_programme !== undefined &&
    props.data.moe_programme.length > 0
  ) {
    moe_programme_boolean = true;
    for (let i = 0; i < props.data.moe_programme.length; i++) {
      if (i !== props.data.moe_programme.length - 1) {
        moe_programme.push(props.data.moe_programme[i].toLowerCase() + " ,  ");
      } else {
        moe_programme.push(props.data.moe_programme[i].toLowerCase());
      }
    }
  }

  if (
    props.data.alp_domain !== undefined &&
    props.data.alp_domain.length > 0 &&
    props.data.alp_domain != "NULL"
  ) {
    alp_domain_boolean = true;
  }

  if (
    props.data.llp_domain1 !== undefined &&
    props.data.llp_domain1.length > 0 &&
    props.data.llp_domain1 != "NULL"
  ) {
    llp_domain1_boolean = true;
  }

  if (
    props.data.llp_domain2 !== undefined &&
    props.data.llp_domain2.length > 0 &&
    props.data.llp_domain2 != "NULL"
  ) {
    llp_domain2_boolean = true;
  }

  return (
    <div className="school-card elective-card">
      <p className="school-name elective-card-school-name">
        {props.data.school_name}
        <FontAwesomeIcon
          className={
            !itemIsFavourite ? "fa-heart-icon" : "fa-heart-icon-toggled"
          }
          icon={faHeart}
          onClick={toggleFavouriteStatusHandler}
        ></FontAwesomeIcon>
      </p>

      <div className="elective-container">
        {moe_programme_boolean ? (
          <div className="elective-div">
            <div className="elective-category">MOE Programme : </div>
            <div className="elective-name"> {moe_programme} </div>
          </div>
        ) : (
          <></>
        )}
        {alp_domain_boolean ? (
          <div className="elective-div">
            <div className="elective-category">{props.data.alp_domain} </div>
            <div className="elective-name"> {props.data.alp_title}</div>
          </div>
        ) : (
          <></>
        )}
        {llp_domain1_boolean ? (
          <div className="elective-div">
            <div className="elective-category">{props.data.llp_domain1} </div>
            <div className="elective-name"> {props.data.llp_title1} </div>
          </div>
        ) : (
          <></>
        )}
        {llp_domain2_boolean ? (
          <div className="elective-div">
            <div className="elective-category">{props.data.llp_domain2} </div>
            <div className="elective-name">{props.data.llp_title2} </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* <div className="container">
        <label className="compare-btn-form-control">
          click to compare
          <input type="checkbox" className="compare-btn"></input>
        </label>
      </div> */}
      <p className="container">
        <FontAwesomeIcon
          className={!toCompare ? "compare-icon" : "compare-icon-toggled"}
          icon={faCodeCompare}
          onClick={toggleCompareHandler}
        ></FontAwesomeIcon>
      </p>
    </div>
  );
}

export default ElectiveCard;
