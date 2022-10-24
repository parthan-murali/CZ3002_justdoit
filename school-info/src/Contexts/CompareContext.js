import React from "react";
import { createContext } from "react";
import { useState } from "react";

const CompareContext = createContext({
  school: [],
  totalSchools: 0,
  addToCompare: (compareSchool) => {},
  removeFromCompare: (schoolId) => {},
  itemToCompare: (schoolId) => {},
}); //context is a javascript object
// FavouritesContext will contain a react component, so follow naming convention of component
// these are initial values
export function CompareContextProvider(props) {
  const [schoolsToCompare, setSchoolsToCompare] = useState([]);

  function addCompareHandler(compareSchool) {
    setSchoolsToCompare((prevSchools) => {
      return prevSchools.concat(compareSchool);
    });
  }

  function removeCompareHandler(schoolId) {
    setSchoolsToCompare((prevSchools) => {
      return prevSchools.filter((school) => school._id !== schoolId);
    });
  }

  function itemCompareHandler(schoolId) {
    return schoolsToCompare.some((school) => school._id === schoolId);
  }

  const context = {
    school: schoolsToCompare,
    totalSchools: schoolsToCompare.length,
    addToCompare: addCompareHandler,
    removeFromCompare: removeCompareHandler,
    itemToCompare: itemCompareHandler,
    // exposes these functions to all wrapped components
  };

  return (
    <CompareContext.Provider value={context}>
      {/* value={context} is for updating the context so that other components wrapped by this provider will be informed
       Wraps around all components that are interested in interacting with the context */}
      {props.children}
    </CompareContext.Provider>
  );
}

export default CompareContext;
