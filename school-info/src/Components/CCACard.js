import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCodeCompare } from "@fortawesome/free-solid-svg-icons";
import "../ComponentsCSS/CCACard.css";

import { useContext } from "react"; // allows us to establish connection btwn this component and the Favourites context
import FavouritesContext from "../Contexts/FavouritesContext";
import CompareContext from "../Contexts/CompareContext";

function CCACard(props) {
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

  let physical_sports_boolean = false;
  let visual_and_pa_boolean = false;
  let clubs_and_societies_boolean = false;
  let uniformed_groups_boolean = false;
  let others_boolean = false;

  let physical_sports = [];
  let visual_and_pa = [];
  let clubs_and_societies = [];
  let uniformed_groups = [];
  let others = [];

  /* To add commas */
  if (
    props.data.physical_sports !== undefined &&
    props.data.physical_sports.length > 0
  ) {
    physical_sports_boolean = true;
    if (
      (props.data.jc_physical_sports !== undefined &&
        props.level === "tertiary") ||
      (props.data.jc_physical_sports !== undefined && props.level === "primary")
    ) {
      for (let i = 0; i < props.data.jc_physical_sports.length; i++) {
        if (i !== props.data.jc_physical_sports.length - 1) {
          physical_sports.push(
            props.data.jc_physical_sports[i].toLowerCase() + " ,  "
          );
        } else {
          physical_sports.push(props.data.jc_physical_sports[i].toLowerCase());
        }
      }
    } else {
      for (let i = 0; i < props.data.physical_sports.length; i++) {
        if (i !== props.data.physical_sports.length - 1) {
          physical_sports.push(
            props.data.physical_sports[i].toLowerCase() + " ,  "
          );
        } else {
          physical_sports.push(props.data.physical_sports[i].toLowerCase());
        }
      }
    }
  }

  if (
    props.data.visual_and_pa !== undefined &&
    props.data.visual_and_pa.length > 0
  ) {
    visual_and_pa_boolean = true;
    if (
      (props.data.jc_visual_and_pa !== undefined &&
        props.level === "tertiary") ||
      (props.data.jc_visual_and_pa !== undefined && props.level === "primary")
    ) {
      for (let i = 0; i < props.data.jc_visual_and_pa.length; i++) {
        if (i !== props.data.jc_visual_and_pa.length - 1) {
          visual_and_pa.push(
            props.data.jc_visual_and_pa[i].toLowerCase() + " ,  "
          );
        } else {
          visual_and_pa.push(props.data.jc_visual_and_pa[i].toLowerCase());
        }
      }
    } else {
      for (let i = 0; i < props.data.visual_and_pa.length; i++) {
        if (i !== props.data.visual_and_pa.length - 1) {
          visual_and_pa.push(
            props.data.visual_and_pa[i].toLowerCase() + " ,  "
          );
        } else {
          visual_and_pa.push(props.data.visual_and_pa[i].toLowerCase());
        }
      }
    }
  }

  if (
    props.data.clubs_and_societies !== undefined &&
    props.data.clubs_and_societies.length > 0
  ) {
    clubs_and_societies_boolean = true;
    if (
      (props.data.jc_clubs_and_societies !== undefined &&
        props.level === "tertiary") ||
      (props.data.jc_clubs_and_societies !== undefined &&
        props.level === "primary")
    ) {
      for (let i = 0; i < props.data.jc_clubs_and_societies.length; i++) {
        if (i !== props.data.jc_clubs_and_societies.length - 1) {
          clubs_and_societies.push(
            props.data.jc_clubs_and_societies[i].toLowerCase() + " ,  "
          );
        } else {
          clubs_and_societies.push(
            props.data.jc_clubs_and_societies[i].toLowerCase()
          );
        }
      }
    } else {
      for (let i = 0; i < props.data.clubs_and_societies.length; i++) {
        if (i !== props.data.clubs_and_societies.length - 1) {
          clubs_and_societies.push(
            props.data.clubs_and_societies[i].toLowerCase() + " ,  "
          );
        } else {
          clubs_and_societies.push(
            props.data.clubs_and_societies[i].toLowerCase()
          );
        }
      }
    }
  }

  if (
    props.data.uniformed_groups !== undefined &&
    props.data.uniformed_groups.length > 0
  ) {
    uniformed_groups_boolean = true;
    if (
      (props.data.jc_uniformed_groups !== undefined &&
        props.level === "tertiary") ||
      (props.data.jc_uniformed_groups !== undefined &&
        props.level === "primary")
    ) {
      for (let i = 0; i < props.data.jc_uniformed_groups.length; i++) {
        if (i !== props.data.jc_uniformed_groups.length - 1) {
          uniformed_groups.push(
            props.data.jc_uniformed_groups[i].toLowerCase() + " ,  "
          );
        } else {
          uniformed_groups.push(
            props.data.jc_uniformed_groups[i].toLowerCase()
          );
        }
      }
    } else {
      for (let i = 0; i < props.data.uniformed_groups.length; i++) {
        if (i !== props.data.uniformed_groups.length - 1) {
          uniformed_groups.push(
            props.data.uniformed_groups[i].toLowerCase() + " ,  "
          );
        } else {
          uniformed_groups.push(props.data.uniformed_groups[i].toLowerCase());
        }
      }
    }
  }

  if (props.data.others !== undefined && props.data.others.length > 0) {
    others_boolean = true;
    if (
      (props.data.jc_others !== undefined && props.level === "tertiary") ||
      (props.data.jc_others !== undefined && props.level === "primary")
    ) {
      for (let i = 0; i < props.data.jc_others.length; i++) {
        if (i !== props.data.jc_others.length - 1) {
          others.push(props.data.jc_others[i].toLowerCase() + " ,  ");
        } else {
          others.push(props.data.jc_others[i].toLowerCase());
        }
      }
    } else {
      for (let i = 0; i < props.data.others.length; i++) {
        if (i !== props.data.others.length - 1) {
          others.push(props.data.others[i].toLowerCase() + " ,  ");
        } else {
          others.push(props.data.others[i].toLowerCase());
        }
      }
    }
  }

  return (
    <div className="school-card cca-card">
      <p className="school-name cca-card-school-name">
        {props.data.school_name}
        <FontAwesomeIcon
          className={
            !itemIsFavourite ? "fa-heart-icon" : "fa-heart-icon-toggled"
          }
          icon={faHeart}
          onClick={toggleFavouriteStatusHandler}
        ></FontAwesomeIcon>
      </p>

      <div className="cca-container">
        {physical_sports_boolean ? (
          <div className="cca-div">
            <div className="cca-category">Physical Sports </div>
            <div className="cca-name"> {physical_sports} </div>
          </div>
        ) : (
          <></>
        )}
        {visual_and_pa_boolean ? (
          <div className="cca-div">
            <div className="cca-category">Visual & Performing Arts </div>
            <div className="cca-name"> {visual_and_pa}</div>
          </div>
        ) : (
          <></>
        )}
        {clubs_and_societies_boolean ? (
          <div className="cca-div">
            <div className="cca-category">Clubs & Societies </div>
            <div className="cca-name"> {clubs_and_societies} </div>
          </div>
        ) : (
          <></>
        )}
        {uniformed_groups_boolean ? (
          <div className="cca-div">
            <div className="cca-category">Uniformed Groups </div>
            <div className="cca-name">{uniformed_groups} </div>
          </div>
        ) : (
          <></>
        )}
        {others_boolean ? (
          <div className="cca-div">
            <div className="cca-category">Others </div>
            <div className="cca-name"> {others} </div>
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

export default CCACard;
