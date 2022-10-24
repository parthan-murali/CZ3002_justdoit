// This component will display the name, Location and MRT location of the school in a card

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCodeCompare,
    faLocationDot,
    faThumbsUp,
    faHeart,
    faTrainSubway,
    faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import "../ComponentsCSS/SchoolsCard.css";

import { useContext } from "react";
import FavouritesContext from "../Contexts/FavouritesContext";
import CompareContext from "../Contexts/CompareContext";
import UpvoteContext from "../Contexts/UpvoteContext";

import { Link } from "react-router-dom";

function SchoolsCard(props) {
    props.data.school_name = props.data.school_name.toLowerCase();
    props.data.address = props.data.address.toLowerCase();
    props.data.mrt_desc = props.data.mrt_desc.toLowerCase();
    const address = props.address;
    const dist = props.distance;

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

    const upvoteCtx = useContext(UpvoteContext);
    const itemIsUpvoted = upvoteCtx.itemIsUpvoted(props.data._id);
    const itemTotalUpvotes = upvoteCtx.totalUpvotes[props.data._id];

    function toggleUpvoteStatusHandler() {
        if (itemIsUpvoted) {
            upvoteCtx.removeUpvote(props.data._id);
        } else {
            upvoteCtx.addUpvote(props.data);
        }
    }

    return (
        <div className="school-card">
            <div className="school-text">
                <p className="school-name school-name-enlarge">
                    <Link
                        className="school-name"
                        to={`/schools/${props.data.school_name}`}
                    >
                        {props.data.school_name}
                    </Link>
                </p>

                <div className="school-text-row">
                    <FontAwesomeIcon
                        className="fa-location-dot-icon"
                        icon={faLocationDot}
                    />

                    <div className="school-address">
                        {props.data.address +
                            "," +
                            " S" +
                            props.data.postal_code}
                    </div>
                </div>
                <div className="school-text-row">
                    <FontAwesomeIcon
                        className="fa-train-subway-icon"
                        icon={faTrainSubway}
                    />
                    <div className="school-address">{props.data.mrt_desc}</div>
                </div>
                {address && (
                    <div className="school-text-row">
                        <FontAwesomeIcon
                            className="fa-arrow-icon"
                            icon={faLocationArrow}
                        />
                        <div className="school-distance">
                            Within {dist / 1000} km radius
                        </div>
                    </div>
                )}
            </div>

            <div className="schools-card-icons">
                <FontAwesomeIcon
                    className={
                        !itemIsFavourite
                            ? "fa-heart-icon"
                            : "fa-heart-icon-toggled"
                    }
                    icon={faHeart}
                    size="lg"
                    onClick={toggleFavouriteStatusHandler}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                    className={
                        !toCompare ? "compare-icon" : "compare-icon-toggled"
                    }
                    icon={faCodeCompare}
                    size="lg"
                    onClick={toggleCompareHandler}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                    className={
                        !itemIsUpvoted ? "fa-thumbs-up" : "fa-thumbs-up-toggled"
                    }
                    icon={faThumbsUp}
                    size="lg"
                    onClick={toggleUpvoteStatusHandler}
                ></FontAwesomeIcon>
                {itemTotalUpvotes}
            </div>
        </div>
    );
}

export default SchoolsCard;
