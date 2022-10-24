import React, { useState, useEffect } from "react";
import { useContext } from "react";
import UpvoteContext from "../Contexts/UpvoteContext";
import SchoolsList from "../Components/SchoolsList";
import { useLocation } from "react-router-dom";
import SecFiltersContext from "../Contexts/SecFiltersContext";
import SchoolsFilter from "../Components/SchoolsFilter";
import { Link } from "react-router-dom";
import { auth, getRec, updateRec } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import data from "../JSON/combined_data.json";

import "../PagesCSS/Recommended/Recommended.css";
import "../ComponentsCSS/SchoolsList.css";
import pic from "../PagesCSS/Recommended/checkmark2.png";

function Recommended() {
    const [currentUser, isLoading] = useAuthState(auth);
    const from = useLocation();
    const [level, setLevel] = useState("");
    const [sort, setSort] = useState("");
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const parsedData = JSON.parse(JSON.stringify(data));
    const navigate = useNavigate();
    let toSave = [];

    const upvoteCtx = useContext(UpvoteContext);
    const filtersCtx = useContext(SecFiltersContext);

    function fetchData() {
        if (from.state) {
            setSort(from.state.sort);
            setLevel(from.state.level);
        } else if (currentUser) {
            getRec(setLoading).then((data) => {
                if (data.schools) {
                    setSchools(data.schools);
                }
                if (data.level) {
                    setLevel(data.level);
                    if (level === "PRIMARY") {
                        setSort("Proximity");
                    } else {
                        setSort("Rank");
                    }
                }
            });
        }
        console.log("Schools =", schools, "Sort =", sort, "Level =", level);
    }

    useEffect(() => {
        let isSub = true;
        if (isLoading || loading) {
            console.log("in useEffect: isLoading");
            return;
        }
        if (!currentUser) {
            toast("Please log in to get recommendations", { type: "info" });
            navigate("/login");
        }
        if (isSub) {
            fetchData();
        }
        if (toSave.length !== 0) {
            updateRec(toSave);
        }
        return () => (isSub = false);
    }, [currentUser, isLoading, from]);

    // get only the schools we want
    const displaySchools = () => {
        console.log(
            "Filter count:",
            filtersCtx.countFilters(),
            filtersCtx.filters
        );
        console.log("Filtered schools :", filtersCtx.filteredSchools);
        if (schools.length !== 0) {
            console.log("schools not empty:", schools);
            let savedSch = parsedData.filter((rec) => {
                return schools.includes(rec.school_name);
            });

            console.log("savedSch:", savedSch);

            return (
                <SchoolsList
                    level={level}
                    schools={savedSch}
                    visitedCount={0}
                    schPerPg={5}
                    sortBy={sort}
                />
            );
        } else {
            toSave = filtersCtx.filteredSchools.map((s) => {
                return s.school_name;
            });
            return (
                <SchoolsList
                    level={level}
                    schools={filtersCtx.filteredSchools}
                    visitedCount={0}
                    schPerPg={5}
                    sortBy={sort}
                />
            );
        }
    };

    return (
        <div className="d-flex flex-column">
            <div className="rec-header">
                <h1 className="rec-title">Schools Recommended</h1>
            </div>
            {from.state || schools.length !== 0 ? (
                displaySchools()
            ) : (
                <div className="rec-empty">
                    <img src={pic} alt="Checkmark" className="rec-img" />
                    <h2 className="rec-empty-heading">
                        No recommendations yet!
                    </h2>
                    <p className="rec-empty-text">
                        Answer a few simple questions and we'll curate<br></br>
                        the top 5 schools that match your profile!
                    </p>
                    <Link to="/dashboard">
                        <button className="rec-button">
                            Build your profile
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Recommended;
