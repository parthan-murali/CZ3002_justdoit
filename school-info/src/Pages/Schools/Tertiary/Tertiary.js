import React from "react";
import SchoolsCard from "../../../Components/SchoolsCard";
import SchoolsList from "../../../Components/SchoolsList";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import Dropdown from "../../../Components/Dropdown";
//import CompareButton from "../../../Components/CompareButton";
import SchoolsFilter from "../../../Components/SchoolsFilter";
import data from "../../../JSON/combined_data.json"; // COMBINED DATASET OF EVERYTHING WE NEED

import "../../../ComponentsCSS/PaginationButtons.css";
import "../../../ComponentsCSS/SchoolsCard.css";
import "../../../ComponentsCSS/SchoolSearchBar.css";
import "../../../ComponentsCSS/SchoolsList.css";

import { SchoolsContext } from "../../../Contexts/SchoolsContext";
import { useContext, useEffect } from "react";
import SecFiltersContext from "../../../Contexts/SecFiltersContext";
import { useLocation } from "react-router-dom";

function Tertiary() {
    const [pageNumber, setPageNumber] = useState(0);
    const schoolsPerPage = 20;
    const noOfSchoolsVisited = pageNumber * schoolsPerPage;
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("A-Z");
    const from = useLocation();

    const { schoolsContext } = useContext(SchoolsContext);
    const secFiltersCtx = useContext(SecFiltersContext);
    //let data = schoolsContext.schools;
    const parsedData = JSON.parse(JSON.stringify(data));

    // initialize schools
    let schools = [];

    if (parsedData !== undefined) {
        // filter to get primary school data
        let index = 0; // to ensure the school appear in numeric order, using i will skip some numbers
        for (let i = 0; i < parsedData.length; i++) {
            if (
                /* Total 18 entries*/
                parsedData[i].mainlevel_code.toLowerCase() ===
                    "JUNIOR COLLEGE".toLowerCase() ||
                (parsedData[i].school_name
                    .toLowerCase()
                    .includes("INSTITUTION".toLowerCase()) &&
                    !parsedData[i].school_name
                        .toLowerCase()
                        .includes("JUNIOR".toLowerCase())) ||
                (parsedData[i].mainlevel_code.toLowerCase() ===
                    "MIXED LEVELS".toLowerCase() &&
                    (parsedData[i].school_name
                        .toLowerCase()
                        .includes("TEMASEK".toLowerCase()) ||
                        parsedData[i].school_name
                            .toLowerCase()
                            .includes("NATIONAL".toLowerCase()) ||
                        parsedData[i].school_name
                            .toLowerCase()
                            .includes("JUNIOR COLLEGE".toLowerCase()) ||
                        parsedData[i].school_name
                            .toLowerCase()
                            .includes("DUNMAN".toLowerCase()) ||
                        parsedData[i].school_name
                            .toLowerCase()
                            .includes("RIVER".toLowerCase()) ||
                        parsedData[i].school_name
                            .toLowerCase()
                            .includes("INDEPENDENT".toLowerCase())))
            ) {
                schools[index++] = parsedData[i];
            }
        }
    }

    useEffect(() => {
        if (from.state) {
            setSort(from.state.sort);
        }
    }, [from]);

    let pageCount = Math.ceil(schools.length / schoolsPerPage);

    // get only the schools we want
    const displaySchools = () => {
        console.log("Filter count:", secFiltersCtx.countFilters());
        if (secFiltersCtx.countFilters() === 0) {
            return (
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center list-count">
                        Showing&nbsp;
                        <b>
                            {secFiltersCtx.countFilters === 0
                                ? schools.length
                                : secFiltersCtx.filteredSchools.length}
                        </b>
                        &nbsp;schools
                    </div>
                    <SchoolsList
                        level="JC"
                        schools={schools}
                        visitedCount={noOfSchoolsVisited}
                        schPerPg={schoolsPerPage}
                        sortBy={sort}
                    />
                </div>
            );
        } else if (from.state !== null && !secFiltersCtx.recDone) {
            secFiltersCtx.setRecDone(true);
            console.log("From recommended");
            pageCount = Math.ceil(secFiltersCtx.filteredSchools.length / 5);
            return (
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center list-count">
                        Showing&nbsp;
                        <b>
                            {secFiltersCtx.countFilters === 0
                                ? schools.length
                                : secFiltersCtx.filteredSchools.length}
                        </b>
                        &nbsp;schools
                    </div>
                    <SchoolsList
                        level="JC"
                        schools={secFiltersCtx.filteredSchools}
                        visitedCount={noOfSchoolsVisited}
                        schPerPg={5}
                        sortBy={from.state.sort}
                    />
                </div>
            );
        } else {
            pageCount = Math.ceil(
                secFiltersCtx.filteredSchools.length / schoolsPerPage
            );
            return (
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center list-count">
                        Showing&nbsp;
                        <b>
                            {secFiltersCtx.countFilters === 0
                                ? schools.length
                                : secFiltersCtx.filteredSchools.length}
                        </b>
                        &nbsp;schools
                    </div>
                    <SchoolsList
                        level="JC"
                        schools={secFiltersCtx.filteredSchools}
                        visitedCount={noOfSchoolsVisited}
                        schPerPg={schoolsPerPage}
                        sortBy={sort}
                    />
                </div>
            );
        }
    };

    const searchSchools = schools
        .filter((value) => {
            let copy = Object.assign({}, value);
            if (searchTerm === "") return copy;
            else if (
                copy.school_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                copy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                copy.postal_code
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                copy.mrt_desc.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return copy;
            }
        })
        .map((school) => (
            <div
                key={school.school_name}
                className="d-flex justify-content-center"
            >
                <SchoolsCard data={school} />
            </div>
        ));

    const handlePageClick = (event) => {
        setPageNumber(event.selected);
        window.scrollTo(0, 0);
    };

    return searchTerm !== "" ? (
        <div className="d-flex m-5">
            <div id="sidebar" className="col-3 me-3">
                <SchoolsFilter level="JC" data={schools} />
            </div>
            <div id="content" className="col ms-3">
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center">
                        <div className="school-level-title">
                            Junior Colleges
                        </div>
                        <Dropdown currentPage={"Tertiary"} />
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <input
                            className="search-bar"
                            type="text"
                            placeholder="Type to Search..."
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {sort}
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            setSort("A-Z");
                                        }}
                                    >
                                        A-Z
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            setSort("Rank");
                                            console.log("sort:", sort);
                                        }}
                                    >
                                        Rank
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={(e) => setSort("Proximity")}
                                    >
                                        Proximity
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {searchSchools}
                </div>
            </div>
        </div>
    ) : (
        <div className="d-flex m-5">
            <div id="sidebar" className="col-3 me-3">
                <SchoolsFilter level="JC" data={schools} />
            </div>
            <div id="content" className="col ms-3">
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center">
                        <div className="school-level-title">
                            Junior Colleges
                        </div>
                        <Dropdown currentPage={"Tertiary"} />
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <input
                            className="search-bar"
                            type="text"
                            placeholder="Type to Search..."
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {sort}
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            setSort("A-Z");
                                        }}
                                    >
                                        A-Z
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            setSort("Rank");
                                            console.log("sort:", sort);
                                        }}
                                    >
                                        Rank
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={(e) => setSort("Proximity")}
                                    >
                                        Proximity
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {displaySchools()}
                    <ReactPaginate
                        previousLabel="<"
                        nextLabel=" >"
                        breakLabel="..."
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={8}
                        renderOnZeroPageCount={null}
                        containerClassName={"paginationButtons"}
                        previousLinkClassName={"previousButtons"}
                        nextLinkClassName={"nextButtons"}
                        disabledClassName={"paginationDisabled"}
                        activeClassName={"paginationActive"}
                    />
                </div>
            </div>
        </div>
    );
}

export default Tertiary;
