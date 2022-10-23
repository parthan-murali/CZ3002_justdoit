import { createContext } from "react";
import { useState, useEffect } from "react";
import cutOffs from "../JSON/PSLE Cut-Off.json";

const PriFiltersContext = createContext({
    filters: {},
    filteredSchools: [],
    recDone: true,
    setRecDone: (flag) => {},
    addFilter: (filter, value) => {},
    removeFilter: (filter, value) => {},
    resetFilters: () => {},
    countFilters: () => {},
    itemIsFilter: (schoolId) => {},
}); //context is a javascript object
// these are initial values

export function PriFiltersContextProvider(props) {
    const [userFilters, setuserFilters] = useState({
        location: null,
        ccas: new Set(),
        subjects: new Set(),
        electives: new Set(),
        genders: new Set(),
        types: new Set(),
        others: new Set(),
    });

    const savedSchools = localStorage.getItem("primarySchools");
    const initialSchools = JSON.parse(savedSchools);
    var schools = initialSchools;
    const [filtered, setFiltered] = useState([]);
    var rec = true;
    const savedCCAs = JSON.parse(localStorage.getItem("primaryCCAData"));

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            doFiltering();
        }
        return () => {
            isMounted = false;
        };
    }, [userFilters]);

    useEffect(() => {}, [filtered]);

    function byLocation() {
        let location = userFilters.location;

        schools = schools.filter((s) => {
            return s.dgp_code === location;
        });
    }

    function byCCAs() {
        let ccaArr = userFilters.ccas;

        schools = schools.filter((s) => {
            let count = ccaArr.size;
            // console.log("Count before =", count);
            ccaArr.forEach((cca) => {
                if (s.physical_sports.includes(cca)) {
                    count -= 1;
                } else if (s.visual_and_pa.includes(cca)) {
                    count -= 1;
                } else if (s.clubs_and_societies.includes(cca)) {
                    count -= 1;
                } else if (s.uniformed_groups.includes(cca)) {
                    count -= 1;
                } else if (s.others.includes(cca)) {
                    count -= 1;
                }
            });

            if (count === 0) {
                console.log("Has all:", s.school_name);
            }
            return count === 0;
        });
    }

    function bySubjects() {
        let subjArr = userFilters.subjects;

        schools = schools.filter((s) => {
            let count = subjArr.size;
            // console.log("Count before =", count);
            subjArr.forEach((subj) => {
                if (s.subject_desc.includes(subj)) {
                    count -= 1;
                }
            });

            // if (count === 0) {
            //     console.log("Has all:", s.school_name);
            // }
            return count === 0;
        });
    }

    function byElectives() {
        let elecArr = userFilters.electives;

        schools = schools.filter((s) => {
            let count = elecArr.size;
            elecArr.forEach((elec) => {
                let moe = s.moe_programme.map((i) => {
                    return i.toUpperCase();
                });
                let alp = s.alp_title.map((i) => {
                    return i.toUpperCase();
                });
                let llp1 = s.llp_title1.map((i) => {
                    return i.toUpperCase();
                });
                let llp2 = s.llp_title2.map((i) => {
                    return i.toUpperCase();
                });
                if (moe.includes(elec)) {
                    count -= 1;
                } else if (alp.includes(elec)) {
                    count -= 1;
                } else if (llp1.includes(elec)) {
                    count -= 1;
                } else if (llp2.includes(elec)) {
                    count -= 1;
                }
            });

            // if (count === 0) {
            //     console.log("Has all:", s.school_name);
            // }
            return count === 0;
        });
    }

    function byGenders() {
        let genders = userFilters.genders;

        schools = schools.filter((s) => {
            if (genders.has("Mixed") && s.nature_code === "CO-ED SCHOOL") {
                return true;
            }
            if (genders.has("Boys") && s.nature_code === "BOYS' SCHOOL") {
                return true;
            }
            if (genders.has("Girls") && s.nature_code === "GIRLS' SCHOOL") {
                return true;
            }
        });
    }

    function byTypes() {
        let types = userFilters.types;

        schools = schools.filter((s) => {
            if (types.has("Autonomous") && s.autonomous_ind === "Yes") {
                return true;
            }
            if (
                types.has("Government School") &&
                s.type_code === "GOVERNMENT SCHOOL"
            ) {
                return true;
            }
            if (
                types.has("Government-Aided School") &&
                s.type_code === "GOVERNMENT-AIDED SCH"
            ) {
                return true;
            }
            if (
                types.has("Specialised Assistance Plan (SAP)") &&
                s.sap_ind === "Yes"
            ) {
                return true;
            }
        });
    }

    function byOthers() {
        let others = userFilters.others;

        schools = schools.filter((s) => {
            if (
                others.has("Gifted Education Programme") &&
                s.gifted_ind === "Yes"
            ) {
                return true;
            }
            if (others.has("Integrated Programme") && s.ip_ind === "Yes") {
                return true;
            }
        });
    }

    function doFiltering() {
        schools = initialSchools;
        console.log("Schools reset: ", schools);
        if (userFilters.location) {
            console.log("Filtering by location", userFilters.location);
            byLocation();
        }
        if (userFilters.ccas.size !== 0) {
            console.log("Filtering by CCAs", userFilters.ccas);
            byCCAs();
        }
        if (userFilters.subjects.size !== 0) {
            console.log("Filtering by Subjects", userFilters.subjects);
            bySubjects();
        }
        if (userFilters.electives.size !== 0) {
            console.log("Filtering by Electives", userFilters.electives);
            byElectives();
        }
        if (userFilters.genders.size !== 0) {
            console.log("Filtering by Genders", userFilters.genders);
            byGenders();
        }
        if (userFilters.types.size !== 0) {
            console.log("Filtering by Types", userFilters.types);
            byTypes();
        }
        if (userFilters.others.size !== 0) {
            console.log("Filtering by Others", userFilters.others);
            byOthers();
        }
        setFiltered(schools);
        // console.log("filtered =", filtered);
    }

    function addFilterHandler(filter, value) {
        console.log("In PriFiltersContext > addFilterHandler...");

        setuserFilters((prev) => {
            console.log("Prev filters =", prev);
            let newSet;

            switch (filter) {
                case "location":
                    return { ...prev, location: value };
                case "ccas":
                    // newSet = prev.ccas.add(value);
                    return { ...prev, ccas: value };
                case "subjects":
                    // newSet = prev.subjects.add(value);
                    return { ...prev, subjects: value };
                case "electives":
                    // newSet = prev.electives.add(value);
                    return { ...prev, electives: value };
                case "genders":
                    // newSet = prev.genders.add(value);
                    if (value.length !== 0) {
                        console.log("Value to Genders =", value);
                        return { ...prev, genders: new Set(value) };
                    } else {
                        return { ...prev, genders: new Set() };
                    }
                case "types":
                    // newSet = prev.types.add(value);
                    return { ...prev, types: new Set(value) };
                case "others":
                    // newSet = prev.others.add(value);
                    return { ...prev, others: new Set(value) };
                default:
                    return prev;
            }
        });
        console.log("New filters =", userFilters);
        // TODO: Handle duplicates

        // setCount(count + 1);

        // doFiltering();
    }

    function removeFilterHandler(filter, value) {
        console.log("In PriFiltersContext > removeFilterHandler...");

        setuserFilters((prev) => {
            console.log("Prev filters =", prev);
            let newSet;

            switch (filter) {
                case "location":
                    return { ...prev, location: null };
                case "ccas":
                    newSet = prev.ccas.delete(value);
                    return { ...prev, ccas: newSet };
                case "subjects":
                    newSet = prev.subjects.delete(value);
                    return { ...prev, subjects: newSet };
                case "electives":
                    newSet = prev.electives.delete(value);
                    return { ...prev, electives: newSet };
                case "genders":
                    newSet = prev.genders.delete(value);
                    return { ...prev, genders: newSet };
                case "types":
                    newSet = prev.types.delete(value);
                    return { ...prev, types: newSet };
                case "others":
                    newSet = prev.others.delete(value);
                    return { ...prev, others: newSet };
                default:
                    return prev;
            }
        });
        console.log("New filters =", userFilters);
        // TODO: Handle duplicates

        // setCount(count - 1);

        // doFiltering();
    }

    function resetFilterHandler() {
        console.log("Clearing all filters...");
        setuserFilters({
            location: null,
            ccas: new Set(),
            subjects: new Set(),
            electives: new Set(),
            genders: new Set(),
            types: new Set(),
            others: new Set(),
        });
    }

    function itemIsFilterHandler(schoolId) {
        return userFilters.some((school) => school._id === schoolId);
    }

    function setRecDone(flag) {
        rec = flag;
    }

    function getFilterCount() {
        let count =
            userFilters.ccas.size +
            userFilters.genders.size +
            userFilters.subjects.size +
            userFilters.electives.size +
            userFilters.types.size +
            userFilters.others.size;
        if (userFilters.location) {
            count += 1;
        }
        return count;
    }

    const context = {
        filters: userFilters,
        filteredSchools: filtered,
        recDone: rec,
        setRecDone: setRecDone,
        addFilter: addFilterHandler,
        removeFilter: removeFilterHandler,
        resetFilters: resetFilterHandler,
        countFilters: getFilterCount,
        itemIsFilter: itemIsFilterHandler,
        // exposes these functions to all wrapped components
    };

    // useEffect(() => {
    //     localStorage.setItem("filters", JSON.stringify(context.filters));
    // }, [context.filters]);

    return (
        <PriFiltersContext.Provider value={context}>
            {/* value={context} is for updating the context so that other components wrapped by this provider will be informed
       Wraps around all components that are interested in interacting with the context */}
            {props.children}
        </PriFiltersContext.Provider>
    );
}

export default PriFiltersContext;
