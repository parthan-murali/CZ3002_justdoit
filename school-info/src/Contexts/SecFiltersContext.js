import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";

const SecFiltersContext = createContext({
    filters: {},
    totalFilters: 0,
    filteredSchools: [],
    addFilter: (filter, value) => {},
    removeFilter: (filter, value) => {},
    itemIsFilter: (schoolId) => {},
}); //context is a javascript object
// these are initial values

export function SecFiltersContextProvider(props) {
    const [userFilters, setuserFilters] = useState({
        location: null,
        cca: null,
        subject: [],
        min: 4,
        max: 32,
        gender: [],
        type: [],
        other: [],
    });

    const [count, setCount] = useState(0);

    const savedSchools = localStorage.getItem("secondarySchools");
    const initialSchools = JSON.parse(savedSchools);
    const [schools, setSchools] = useState(initialSchools);

    function byLocation(location) {
        let res = schools.filter((s) => {
            return s.dgp_code === location;
        });
        return res;
    }

    // function by

    function addFilterHandler(filter, value) {
        setuserFilters((prevUserFilters) => {
            console.log("Prev filters =", prevUserFilters);
            if (prevUserFilters[filter] === null) {
                console.log("Single-value");
                prevUserFilters[filter] = value;
                return prevUserFilters;
            } else if (typeof prevUserFilters[filter] === "string") {
                console.log("Single-value, removing existing first");
                removeFilterHandler(filter, value);
                prevUserFilters[filter] = value;
                return prevUserFilters;
            } else {
                prevUserFilters[filter].push(value);
                return prevUserFilters;
            }
        });
        console.log("New filters =", userFilters);
        // TODO: Handle duplicates

        setCount(count + 1);

        if (filter === "location") {
            console.log("Adding location filter", value);
            setSchools(byLocation(value));
        }
    }

    function removeFilterHandler(filter, value) {
        setuserFilters((prevUserFilters) => {
            console.log("Prev filters =", prevUserFilters);
            if (typeof prevUserFilters[filter] === "string") {
                console.log("Removing single-value");
                prevUserFilters[filter] = null;
                return prevUserFilters;
            } else if (prevUserFilters[filter] === null) {
                setCount(count + 1); // prevent getting negative number when setting count below
                return prevUserFilters;
            } else {
                let idx = prevUserFilters[filter].indexOf(value);
                prevUserFilters[filter].splice(idx, 1);
                return prevUserFilters;
            }
        });
        console.log("New filters =", userFilters);
        // TODO: Handle duplicates

        setCount(count - 1);

        if (filter === "location") {
            console.log("Removing location filter", value);
            setSchools(initialSchools);
        }
    }

    function itemIsFilterHandler(schoolId) {
        return userFilters.some((school) => school._id === schoolId);
    }

    const context = {
        filters: userFilters,
        totalFilters: count,
        filteredSchools: schools,
        addFilter: addFilterHandler,
        removeFilter: removeFilterHandler,
        itemIsFilter: itemIsFilterHandler,
        // exposes these functions to all wrapped components
    };

    // useEffect(() => {
    //     localStorage.setItem("filters", JSON.stringify(context.filters));
    // }, [context.filters]);

    return (
        <SecFiltersContext.Provider value={context}>
            {/* value={context} is for updating the context so that other components wrapped by this provider will be informed
       Wraps around all components that are interested in interacting with the context */}
            {props.children}
        </SecFiltersContext.Provider>
    );
}

export default SecFiltersContext;
