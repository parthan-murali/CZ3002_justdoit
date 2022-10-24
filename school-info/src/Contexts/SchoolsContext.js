import React from "react";
import { createContext, useState, useEffect } from "react";

import { getDatabase, ref, onValue } from "firebase/database";

export const SchoolsContext = createContext();

export const SchoolsContextProvider = (props) => {
  const [schools, setSchools] = useState();

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "schools/");
    const unsub = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setSchools(data);

    });
    console.log("testing to see if it gets called once"); // ensure gets called once
    return unsub;
  }, []);

  const schoolsContext = {
    schools
  };

  return (
    <SchoolsContext.Provider value={{ schoolsContext }}>
      {props.children}
    </SchoolsContext.Provider>
  );
};
