import React from "react";
import { useContext } from "react";
import FavouritesContext from "../Contexts/FavouritesContext";
import SchoolsList from "../Components/SchoolsList";
import "../PagesCSS/Favourites/Favourites.css";
import { Link } from "react-router-dom";

import pic from "../PagesCSS/Favourites/heart.png";

function Favourites() {
    const favouritesCtx = useContext(FavouritesContext);
    // gives us the current context

    let content;

    if (favouritesCtx.totalFavourites === 0) {
        content = (
            <div className="fav-empty">
                <img src={pic} alt="Heart" className="fav-img" />
                <h2 className="fav-empty-heading">No favourites yet!</h2>
                <p className="fav-empty-text">
                    See a school you like?
                    <br></br>
                    Save them to your favourites page now!
                </p>
                <Link to="/schools">
                    <button className="fav-button">Start exploring</button>
                </Link>
            </div>
        );
    } else {
        console.log(favouritesCtx.favourites);
        content = (
            <div>
                <SchoolsList
                    schools={favouritesCtx.favourites}
                    visitedCount=""
                    schPerPg=""
                    sortBy="Fav"
                    level=""
                />
            </div>
        );
    }

    return (
        <section>
            <div className="fav-header">
                <h1 className="fav-title">
                    Schools I'm interested in ({favouritesCtx.totalFavourites})
                </h1>
            </div>
            {content}
        </section>
    );
}

export default Favourites;
