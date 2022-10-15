import React from "react";
import SchoolsCard from "../../../Components/SchoolsCard";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import Dropdown from "../../../Components/Dropdown";
//import CompareButton from "../../../Components/CompareButton";
import SchoolsFilter from "../../../Components/SchoolsFilter";
import data from "../../../JSON/combined_data.json"; // COMBINED DATASET OF EVERYTHING WE NEED

import "../../../ComponentsCSS/PaginationButtons.css";
import "../../../ComponentsCSS/SchoolsCard.css";
import "../../../ComponentsCSS/SchoolSearchBar.css";
import "../../../PagesCSS/Schools/Schools.css";

import { SchoolsContext } from "../../../Contexts/SchoolsContext";
import { useContext } from "react";

function Secondary() {
    const [pageNumber, setPageNumber] = useState(0);
    const schoolsPerPage = 20;
    const noOfSchoolsVisited = pageNumber * schoolsPerPage;
    const [searchTerm, setSearchTerm] = useState("");

    const { schoolsContext } = useContext(SchoolsContext);
    //let data = schoolsContext.schools;

    // initialize schools
    let schools = [];

    if (data !== undefined) {
        // filter to get primary school data
        let index = 0; // to ensure the school appear in numeric order, using i will skip some numbers
        for (let i = 0; i < data.length; i++) {
            if (
                data[i].mainlevel_code === "SECONDARY" ||
                data[i].mainlevel_code === "MIXED LEVELS"
            ) {
                schools[index++] = data[i];
            }
        }
    }

    // get only the schools we want
    const displaySchools = schools
        .slice(noOfSchoolsVisited, noOfSchoolsVisited + schoolsPerPage)
        .map((school) => (
            <div key={school.school_name}>
                <SchoolsCard data={school} />
            </div>
        ));

    const searchSchools = schools
        .filter((value) => {
            if (searchTerm === "") return value;
            else if (
                value.school_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                value.address
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                value.postal_code
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                value.mrt_desc.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return value;
            }
        })
        .map((school) => (
            <div key={school.school_name} className="d-flex justify-content-center">
                <SchoolsCard data={school} />
            </div>
        ));

    // Determine number of pages
    const pageCount = Math.ceil(schools.length / schoolsPerPage);

    const handlePageClick = (event) => {
        setPageNumber(event.selected);
        window.scrollTo(0, 0);
    };

    return searchTerm !== "" ? (
        <div className="d-flex">
            <div id="sidebar" className="p-2 flex-fill">
                <SchoolsFilter level="SECONDARY" data={schools} />
            </div>
            <div id="content" className="p-5 flex-fill">
                <div className="p-2 flex-fill">
                    <Dropdown currentPage={"Secondary"} />
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Type to Search..."
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "70%",
                        margin: "auto",
                        marginBottom: "1rem",
                    }}
                >
                    <div className="school-level-title">Secondary Schools </div>
                </div>

                {searchSchools}
            </div>
        </div>
    ) : (
        <div className="d-flex">
            <div id="sidebar" className="p-2 flex-fill">
                <SchoolsFilter level="SECONDARY" data={schools} />
            </div>
            <div id="content" className="p-5 flex-fill">
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center">
                        <div className="school-level-title">
                            Secondary Schools
                        </div>
                        <Dropdown currentPage={"Secondary"} />
                    </div>
                    <div className="d-flex justify-content-center">
                        <input
                            className="search-bar"
                            type="text"
                            placeholder="Type to Search..."
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>
                    {displaySchools}
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

export default Secondary;
