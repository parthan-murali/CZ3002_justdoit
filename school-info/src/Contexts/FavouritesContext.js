import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";

const FavouritesContext = createContext({
  favourites: [],
  totalFavourites: 0,
  addFavourite: (favouriteSchool) => {},
  removeFavourite: (schoolId) => {},
  itemIsFavourite: (schoolId) => {},
}); //context is a javascript object
// these are initial values

export function FavouritesContextProvider(props) {
  const [userFavourites, setuserFavourites] = useState(() => {
    // getting stored value (not logged in)
    const saved = localStorage.getItem("favourites");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });

  function addFavouriteHandler(favouriteSchool) {
    setuserFavourites((prevUserFavourites) => {
      return prevUserFavourites.concat(favouriteSchool);
    });
  }

  function removeFavouriteHandler(schoolId) {
    setuserFavourites((prevUserFavourites) => {
      return prevUserFavourites.filter((school) => school._id !== schoolId);
    });
  }

  function itemIsFavouriteHandler(schoolId) {
    return userFavourites.some((school) => school._id === schoolId);
  }

  const context = {
    favourites: userFavourites,
    totalFavourites: userFavourites.length,
    addFavourite: addFavouriteHandler,
    removeFavourite: removeFavouriteHandler,
    itemIsFavourite: itemIsFavouriteHandler,
    // exposes these functions to all wrapped components
  };

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(context.favourites));
  }, [context.favourites]);

  return (
    <FavouritesContext.Provider value={context}>
      {/* value={context} is for updating the context so that other components wrapped by this provider will be informed
       Wraps around all components that are interested in interacting with the context */}
      {props.children}
    </FavouritesContext.Provider>
  );
}

export default FavouritesContext;
