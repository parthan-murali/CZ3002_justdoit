import SchoolsCard from "./SchoolsCard";
import "../ComponentsCSS/SchoolsList.css";
import React from "react";
import psle from "../JSON/PSLE Cut-Off.json";
import haversine from "haversine-distance";

function SchoolsList(props) {
    const schools = JSON.parse(JSON.stringify(props.schools));
    const noOfSchoolsVisited = props.visitedCount;
    const schoolsPerPage = props.schPerPg;
    const sortBy = props.sortBy;
    const level = props.level;

    console.log("SchoolsList > schools =", schools);

    function byRank(a, b) {
        // console.log("SchoolsList > byRank");
        let aRanges = {};
        let bRanges = {};
        if (level === "SECONDARY") {
            // console.log(a.school_name, "vs", b.school_name);

            psle.forEach((rec) => {
                let name = rec.Name.toUpperCase();
                let aName = a.school_name.toUpperCase();
                let bName = b.school_name.toUpperCase();

                if (name === aName) {
                    console.log("NAME FOUND");
                    let ex = rec.Express.Non_affiliated;
                    if (ex !== "Nil" && ex !== "NIL") {
                        ex = ex.split("-");
                        aRanges["Express"] = ex[1];
                    }
                    let na = rec.Na.Non_affiliated;
                    if (na !== "Nil" && na !== "NIL") {
                        na = na.split("-");
                        aRanges["N(A)"] = na[1];
                    }

                    let nt = rec.Nt.Non_affiliated;
                    if (nt !== "Nil" && nt !== "NIL") {
                        nt = nt.split("-");
                        aRanges["N(T)"] = nt[1];
                    }
                }
                if (name === aName + " IP") {
                    let ip = rec.Express.Non_affiliated;
                    if (ip !== "Nil" && ip !== "NIL") {
                        ip = ip.split("-");
                        aRanges["IP"] = ip[1];
                    }
                }

                if (name === bName) {
                    let ex = rec.Express.Non_affiliated;
                    if (ex !== "Nil" && ex !== "NIL") {
                        ex = ex.split("-");
                        bRanges["Express"] = ex[1];
                    }
                    let na = rec.Na.Non_affiliated;
                    if (na !== "Nil" && na !== "NIL") {
                        na = na.split("-");
                        bRanges["N(A)"] = na[1];
                    }

                    let nt = rec.Nt.Non_affiliated;
                    if (nt !== "Nil" && nt !== "NIL") {
                        nt = nt.split("-");
                        bRanges["N(T)"] = nt[1];
                    }
                }
                if (name === bName + " IP") {
                    let ip = rec.Express.Non_affiliated;
                    if (ip !== "Nil" && ip !== "NIL") {
                        ip = ip.split("-");
                        bRanges["IP"] = ip[1];
                    }
                }
            });

            // console.log("aRanges =", aRanges, "bRanges =", bRanges);

            if ("IP" in aRanges && "IP" in bRanges) {
                if (aRanges["IP"] < bRanges["IP"]) {
                    return -1;
                } else if (aRanges["IP"] > bRanges["IP"]) {
                    return 1;
                }
            } else if ("IP" in aRanges && "IP" in bRanges === false) {
                return -1;
            } else if ("IP" in aRanges === false && "IP" in bRanges) {
                return 1;
            }

            // console.log("Both no/same IP score");

            if ("Express" in aRanges && "Express" in bRanges) {
                if (aRanges["Express"] < bRanges["Express"]) {
                    return -1;
                } else if (aRanges["Express"] > bRanges["Express"]) {
                    return 1;
                }
            } else if ("Express" in aRanges && "Express" in bRanges === false) {
                return -1;
            } else if ("Express" in aRanges === false && "Express" in bRanges) {
                return 1;
            }

            // console.log("Both no/same Express score");

            if ("N(A)" in aRanges && "N(A)" in bRanges) {
                if (aRanges["N(A)"] < bRanges["N(A)"]) {
                    return -1;
                } else if (aRanges["N(A)"] > bRanges["N(A)"]) {
                    return 1;
                }
            } else if ("N(A)" in aRanges && "N(A)" in bRanges === false) {
                return -1;
            } else if ("N(A)" in aRanges === false && "N(A)" in bRanges) {
                return 1;
            }

            // console.log("Both no/same N(A) score");

            if ("N(T)" in aRanges && "N(T)" in bRanges) {
                if (aRanges["N(T)"] < bRanges["N(T)"]) {
                    return -1;
                } else if (aRanges["N(T)"] > bRanges["N(T)"]) {
                    return 1;
                }
            } else if ("N(T)" in aRanges && "N(T)" in bRanges === false) {
                return -1;
            } else if ("N(T)" in aRanges === false && "N(T)" in bRanges) {
                return 1;
            }

            // console.log("Both no/same N(T) score");

            return 0;
        }
    }

    // function byProximity()

    function getSorted() {
        const content = schools
            .sort((a, b) => {
                if (sortBy === "Rank") {
                    // console.log("Sorting by Rank");
                    return byRank(a, b);
                }
            })
            .slice(noOfSchoolsVisited, noOfSchoolsVisited + schoolsPerPage)
            .map((school) => {
                return (
                    <div key={school.school_name}>
                        <SchoolsCard data={school} />
                    </div>
                );
            });

        return content;
    }

    return (
        <ul className="list">
            {sortBy === "A-Z"
                ? schools
                      .slice(
                          noOfSchoolsVisited,
                          noOfSchoolsVisited + schoolsPerPage
                      )
                      .map((school) => {
                          return (
                              <div key={school.school_name}>
                                  <SchoolsCard data={school} />
                              </div>
                          );
                      })
                : getSorted()}
        </ul>
    );
}

export default SchoolsList;

// return schools
//     .slice(noOfSchoolsVisited, noOfSchoolsVisited + schoolsPerPage)
//     .map((school) => (
//         <div key={school.school_name}>
//             <SchoolsCard data={school} />
//         </div>
//     ));
