import { createContext } from "react";
import { useState, useEffect } from "react";
import cutOffs from "../JSON/PSLE Cut-Off.json";
import jcRanks from "../JSON/jcRankings.json";

const SecFiltersContext = createContext({
    filters: {},
    filteredSchools: [],
    recDone: true,
    setRecDone: (flag) => {},
    addFilter: (filter, value) => {},
    removeFilter: (filter, value) => {},
    resetFilters: () => {},
    countFilters: () => {},
}); //context is a javascript object
// these are initial values

export function SecFiltersContextProvider(props) {
    const [userFilters, setuserFilters] = useState({
        location: null,
        address: null,
        ccas: new Set(),
        subjects: new Set(),
        electives: new Set(),
        min: "4",
        max: "32",
        l1r5: "20",
        genders: new Set(),
        types: new Set(),
        others: new Set(),
    });

    const savedSchools = localStorage.getItem("schools");
    const initialSchools = JSON.parse(savedSchools);
    var schools = initialSchools;
    const [filtered, setFiltered] = useState([]);
    var rec = true;
    const savedCCAs = JSON.parse(localStorage.getItem("secondaryCCAData"));

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

    function byL1R5() {
        let l1r5 = parseInt(userFilters.l1r5);

        console.log("l1r5 =", l1r5);

        schools = schools.filter((s) => {
            if (s.arts.length !== 0 && s.arts[0] !== "-") {
                if (parseInt(s.arts[0]) <= l1r5) {
                    return true;
                }
            }
            if (s.science.length !== 0 && s.science[0] !== "-") {
                if (parseInt(s.science[0]) <= l1r5) {
                    return true;
                }
            }
            return false;
        });
    }

    function byScore() {
        let min = userFilters.min;
        let max = userFilters.max;
        console.log("min =", min);
        console.log("max =", max);

        // get all rows of cutoffs where the requested range fits
        let withinRange = cutOffs.filter((rec) => {
            let ranges = [];

            // console.log("Name =", rec.Name);
            let ex1 = rec.Express.Affiliated;
            // console.log("ex1 =", ex1);
            if (ex1 !== "Nil" && ex1 !== "NIL") {
                ex1 = ex1.split("-");
                ex1 = ex1.map((n) => {
                    return n.replace(/\D/g, "");
                });
                ranges.push(ex1);
            }

            // console.log("Get ex2");
            let ex2 = rec.Express.Non_affiliated;
            // console.log("ex2 =", ex2);
            if (ex2 !== "Nil" && ex2 !== "NIL") {
                ex2 = ex2.split("-");
                // console.log("ex2 =", ex2);
                ex2 = ex2.map((n) => {
                    return n.replace(/\D/g, "");
                });
                // console.log("ex2 =", ex2);
                ranges.push(ex2);
            }

            // console.log("Get na1");
            let na1 = rec.Na.Affiliated;
            if (na1 !== "Nil" && na1 !== "NIL") {
                na1 = na1.split("-");
                ranges.push(na1);
            }

            // console.log("Get na2");
            let na2 = rec.Na.Non_affiliated;
            if (na2 !== "Nil" && na2 !== "NIL") {
                na2 = na2.split("-");
                ranges.push(na2);
            }

            let nt1 = rec.Nt.Affiliated;
            if (nt1 !== "Nil" && nt1 !== "NIL") {
                nt1 = nt1.split("-");
                ranges.push(nt1);
            }

            let nt2 = rec.Nt.Non_affiliated;
            if (nt2 !== "Nil" && nt2 !== "NIL") {
                nt2 = nt2.split("-");
                ranges.push(nt2);
            }

            for (let i = parseInt(min); i <= parseInt(max); i++) {
                for (let j = 0; j < ranges.length; j++) {
                    // console.log(
                    //     "Name =",
                    //     rec.Name,
                    //     "i =",
                    //     i,
                    //     "range =",
                    //     ranges[j][0],
                    //     ranges[j][1]
                    // );
                    if (i >= ranges[j][0] && i <= ranges[j][1]) {
                        return true;
                    }
                }
            }
            return false;
        });

        let chosenNames = withinRange.map((row) => {
            let name = row.Name;
            if (
                name.charAt(name.length - 2) + name.charAt(name.length - 1) ===
                "IP"
            ) {
                // console.log("IP!");
                name = name.slice(0, -3);
            }
            return name.toUpperCase();
        });

        // console.log("chosenNames =", chosenNames);

        schools = schools.filter((s) => {
            return chosenNames.includes(s.school_name);
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
                types.has("Independent School") &&
                s.type_code === "INDEPENDENT SCHOOL"
            ) {
                return true;
            }
            if (
                types.has("Specialised Assistance Plan (SAP)") &&
                s.sap_ind === "Yes"
            ) {
                return true;
            }
            if (
                types.has("Specialised Independent School") &&
                s.type_code === "SPECIALISED INDEPENDENT SCHOOL"
            ) {
                return true;
            }
            if (
                types.has("Specialised School") &&
                s.type_code === "SPECIALISED SCHOOL"
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
        if (userFilters.min !== "4" || userFilters.max !== "32") {
            console.log(
                "Filtering by score range",
                userFilters.min,
                "-",
                userFilters.max
            );
            byScore();
        }
        if (userFilters.l1r5 !== "20") {
            console.log("Filtering by L1R5", userFilters.l1r5);
            byL1R5();
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
        console.log("In SecFiltersContext > addFilterHandler...");

        setuserFilters((prev) => {
            console.log("Prev filters =", prev);
            let newSet;

            switch (filter) {
                case "location":
                    return { ...prev, location: value };
                case "address":
                    return { ...prev, address: value };
                case "min":
                    return { ...prev, min: value };
                case "max":
                    return { ...prev, max: value };
                case "l1r5":
                    return { ...prev, l1r5: value };
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
        console.log("In SecFiltersContext > removeFilterHandler...");

        setuserFilters((prev) => {
            console.log("Prev filters =", prev);
            let newSet;

            switch (filter) {
                case "location":
                    return { ...prev, location: null };
                case "address":
                    return { ...prev, address: null };
                case "min":
                    return { ...prev, min: "4" };
                case "max":
                    return { ...prev, max: "32" };
                case "l1r5":
                    return { ...prev, max: "20" };
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
            address: null,
            ccas: new Set(),
            subjects: new Set(),
            electives: new Set(),
            min: "4",
            max: "32",
            l1r5: "20",
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
        if (userFilters.min !== "4" || userFilters.max !== "32") {
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
