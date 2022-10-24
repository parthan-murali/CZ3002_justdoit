import SchoolsCard from "./SchoolsCard";
import "../ComponentsCSS/SchoolsList.css";
import React, { useContext, useState, useEffect } from "react";
import psle from "../JSON/PSLE Cut-Off.json";
import geoData from "../JSON/allGeoData.json";
import jcRanks from "../JSON/jcRankings.json";
import { getDistance } from "geolib";
import SecFiltersContext from "../Contexts/SecFiltersContext";
import axios from "axios";

function SchoolsList(props) {
    const schools = JSON.parse(JSON.stringify(props.schools));
    const noOfSchoolsVisited = props.visitedCount;
    const schoolsPerPage = props.schPerPg;
    const sortBy = props.sortBy;
    const level = props.level;
    const filtersCtx = useContext(SecFiltersContext);
    const address = filtersCtx.filters.address;
    console.log("address =", address);
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");

    console.log("SchoolsList > schools =", schools);

    async function fetchLatLong() {
        let controller = new AbortController();
        const url =
            "https://developers.onemap.sg/commonapi/search?searchVal=" +
            address +
            "&returnGeom=Y&getAddrDetails=Y";

        try {
            const getLatLong = await axios.get(url);
            const latLongData = getLatLong.data.results[0];
            console.log("latLongData =", getLatLong);
            setLat(latLongData.LATITUDE);
            setLong(latLongData.LONGITUDE);

            console.log("Fetch lat and long COMPLETE");
        } catch (err) {
            console.error(err);
        }

        controller.abort();
    }

    useEffect(() => {
        let isMounted = true;

        if (isMounted && address) {
            console.log("Fetching lat and long...");
            fetchLatLong();
        }
        return () => {
            isMounted = false;
        };
    }, [address]);

    function byRank(a, b) {
        // console.log("SchoolsList > byRank");

        if (level === "SECONDARY") {
            // console.log(a.school_name, "vs", b.school_name);
            let aRanges = {};
            let bRanges = {};
            psle.forEach((rec) => {
                let name = rec.Name.toUpperCase();
                let aName = a.school_name.toUpperCase();
                let bName = b.school_name.toUpperCase();

                if (name === aName) {
                    // console.log("NAME FOUND");
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

        if (level === "JC") {
            let aRank, bRank;
            jcRanks.forEach((rec) => {
                if (rec.school_name === a.school_name) {
                    aRank = parseInt(rec.jc_rank);
                }
                if (rec.school_name === b.school_name) {
                    bRank = parseInt(rec.jc_rank);
                }
            });

            return aRank - bRank;
        }
    }

    function getDist(x) {
        let xLat, xLong;
        geoData.forEach((rec) => {
            if (rec.POSTAL === x.postal_code) {
                xLat = rec.LATITUDE;
                xLong = rec.LONGITUDE;
            }
        });
        return getDistance(
            { latitude: lat, longitude: long },
            { latitude: xLat, longitude: xLong }
        );
    }

    function byProximity(a, b) {
        if (address) {
            let aLat, aLong, bLat, bLong;
            geoData.forEach((rec) => {
                if (rec.POSTAL === a.postal_code) {
                    aLat = rec.LATITUDE;
                    aLong = rec.LONGITUDE;
                }
                if (rec.POSTAL === b.postal_code) {
                    bLat = rec.LATITUDE;
                    bLong = rec.LONGITUDE;
                }
            });

            const aDist = getDistance(
                { latitude: lat, longitude: long },
                { latitude: aLat, longitude: aLong }
            );

            const bDist = getDistance(
                { latitude: lat, longitude: long },
                { latitude: bLat, longitude: bLong }
            );

            return aDist - bDist;
        }
    }

    function getSorted() {
        const content = schools
            .sort((a, b) => {
                if (sortBy === "Rank") {
                    // console.log("Sorting by Rank");
                    return byRank(a, b);
                }
                if (sortBy === "Proximity") {
                    return byProximity(a, b);
                }
            })
            .slice(noOfSchoolsVisited, noOfSchoolsVisited + schoolsPerPage)
            .map((school) => {
                return (
                    <div key={school.school_name}>
                        <SchoolsCard
                            data={school}
                            address={address}
                            distance={getDist(school)}
                        />
                    </div>
                );
            });

        return content;
    }

    return (
        <ul className="list">
            {sortBy === "Fav"
                ? schools.map((school) => {
                      return (
                          <div key={school.school_name}>
                              <SchoolsCard
                                  data={school}
                                  address={address}
                                  distance={getDist(school)}
                              />
                          </div>
                      );
                  })
                : sortBy === "A-Z"
                ? schools
                      .slice(
                          noOfSchoolsVisited,
                          noOfSchoolsVisited + schoolsPerPage
                      )
                      .map((school) => {
                          return (
                              <div key={school.school_name}>
                                  <SchoolsCard
                                      data={school}
                                      address={address}
                                      distance={getDist(school)}
                                  />
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
