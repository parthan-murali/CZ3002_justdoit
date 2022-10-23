import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";

const UpvoteContext = createContext({
    upvotes: [],
    // totalFavourites: 0,
    addUpvote: (upvoteSchool) => {},
    removeUpvote: (schoolId) => {},
    itemIsUpvoted: (schoolId) => {},
  });

  export function UpvoteContextProvider(props) {
    const [userUpvotes, setuserUpvotes] = useState(() => {
      // getting stored value (not logged in)
      const saved = localStorage.getItem("upvotes");
      const initialValue = JSON.parse(saved);
      return initialValue || [];
    });
  
    function addUpvoteHandler(upvoteSchool) {
      setuserUpvotes((prevUserUpvotes) => {
        return prevUserUpvotes.concat(upvoteSchool);
      });
    }
  
    function removeUpvoteHandler(schoolId) {
      setuserUpvotes((prevUserUpvotes) => {
        return prevUserUpvotes.filter((school) => school._id !== schoolId);
      });
    }
  
    function itemIsUpvotedHandler(schoolId) {
      return userUpvotes.some((school) => school._id === schoolId);
    }
  
    const context = {
      upvotes: userUpvotes,
    //   totalFavourites: userFavourites.length,
      addUpvote: addUpvoteHandler,
      removeUpvote: removeUpvoteHandler,
      itemIsUpvoted: itemIsUpvotedHandler,
      // exposes these functions to all wrapped components
    };
  
    useEffect(() => {
      localStorage.setItem("upvotes", JSON.stringify(context.upvotes));
    }, [context.upvotes]);
  
    return (
      <UpvoteContext.Provider value={context}>
        {/* value={context} is for updating the context so that other components wrapped by this provider will be informed
         Wraps around all components that are interested in interacting with the context */}
        {props.children}
      </UpvoteContext.Provider>
    );
  }
  
  export default UpvoteContext;