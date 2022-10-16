import axios from "axios";
import { useState, useEffect, useContext } from "react";
import SecFiltersContext from "../Contexts/SecFiltersContext";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../Firebase";

function SchoolsFilter(props) {
    const schools = props.data;
    // console.log(schools);

    const inLevel = (schName) => {
        let nameList = schools.map((school) => {
            return school.school_name.toUpperCase();
        });

        return nameList.includes(schName);
    };

    const level = props.level;
    const lvlName = level.toLowerCase();
    const districts = getDistricts(schools);
    const [ccaGrps, setCCAGrps] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [electives, setElectives] = useState(null);
    const genders = ["Boys", "Girls", "Mixed"];
    const types = [
        "Autonomous",
        "Government School",
        "Government-Aided School",
        "Independent School",
        "Specialised Assistance Plan (SAP)",
        "Specialised Independent School",
        "Specialised School",
    ];
    const others = ["Gifted Education Programme", "Integrated Programme"];

    const [locationF, setLocationF] = useState("");
    const [ccaF, setCCAF] = useState("");
    const [subjectF, setSubjectF] = useState([]);
    const [electiveF, setElectiveF] = useState([]);
    const [minF, setMinF] = useState(4);
    const [maxF, setMaxF] = useState(32);
    let genderDict = Object.assign({}, ...genders.map((x) => ({ [x]: false })));
    const [genderF, setGenderF] = useState(genderDict);
    let typeDict = Object.assign({}, ...types.map((x) => ({ [x]: false })));
    const [typeF, setTypeF] = useState(typeDict);
    let otherDict = Object.assign({}, ...others.map((x) => ({ [x]: false })));
    const [otherF, setOtherF] = useState(otherDict);

    async function fetchData() {
        let controller = new AbortController();
        const ccasURL =
            "https://data.gov.sg/api/action/datastore_search?resource_id=dd7a056a-49fa-4854-bd9a-c4e1a88f1181&limit=5430";
        const subjectsURL =
            "https://data.gov.sg/api/action/datastore_search?resource_id=3bb9e6b0-6865-4a55-87ba-cc380bc4df39&limit=3390";
        const electivesURL =
            "https://data.gov.sg/api/action/datastore_search?resource_id=9a94c7ed-710b-4ba5-8e01-8588f129efcc&limit=80";

        try {
            const getCCAs = await axios.get(ccasURL);
            let ccaData = getCCAs.data.result.records;
            ccaData = ccaData.filter((rec) => {
                return (
                    rec.school_section === level ||
                    rec.school_section === "MIXED LEVELS"
                );
            });
            localStorage.setItem(lvlName + "CCAData", JSON.stringify(ccaData));
            let groups = new Set(
                ccaData.map((rec) => {
                    return rec.cca_grouping_desc;
                })
            );
            let sortedGroups = [...groups].sort();
            setCCAGrps(sortedGroups);

            const getSubjects = await axios.get(subjectsURL);
            let subjectData = getSubjects.data.result.records;
            subjectData = subjectData.filter((rec) => {
                return inLevel(rec.school_name);
            });
            localStorage.setItem(
                lvlName + "subjectData",
                JSON.stringify(subjectData)
            );
            let subjSet = new Set(
                subjectData.map((rec) => {
                    return rec.subject_desc;
                })
            );
            let sortedSubj = [...subjSet].sort();
            setSubjects(sortedSubj);

            const getElectives = await axios.get(electivesURL);
            let electiveData = getElectives.data.result.records;
            electiveData = electiveData.filter((rec) => {
                return inLevel(rec.school_name);
            });
            localStorage.setItem(
                lvlName + "electiveData",
                JSON.stringify(electiveData)
            );
            let elecSet = new Set(
                electiveData.map((rec) => {
                    return rec.moe_programme_desc;
                })
            );
            let sortedElec = [...elecSet].sort();
            setElectives(sortedElec);

            console.log("Fetch COMPLETE");
        } catch (err) {
            console.error(err);
        }

        controller.abort();
    }

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchData();
            localStorage.setItem(lvlName + "Schools", JSON.stringify(schools));
        }
        return () => {
            isMounted = false;
        };
    }, [level]);

    function titleCase(str) {
        // console.log("str =", str);
        return str
            .toLowerCase()
            .split(" ")
            .map(function (word) {
                if (word.charAt(0) === "(") {
                    return word.toUpperCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

    function getDistricts(schools) {
        let uniqueDistricts = [
            ...new Set(
                schools.map(function (school) {
                    return school.dgp_code;
                })
            ),
        ];
        let sortedDistricts = uniqueDistricts.sort();

        return sortedDistricts;
    }

    const secFiltersCtx = useContext(SecFiltersContext);

    function toggleFilterAdd(filter, value) {
        console.log("Handling filter add");
        secFiltersCtx.addFilter(filter, value);
    }

    function toggleFilterRemove(filter, value) {
        console.log("Handling filter remove");
        secFiltersCtx.removeFilter(filter, value);
    }

    function validTerm(field, term) {
        let upper = term.toUpperCase();

        if (field === "subjects") {
            return subjects.indexOf(upper);
        } else if (field === "electives") {
            return electives.indexOf(upper);
        }
    }

    function handleChange(e) {
        console.log("Entering HANDLE CHANGE");
        let id = e.target.id;
        let val = e.target.value;
        // console.log("val =", val, "val type =", typeof val);
        if (id === "location") {
            console.log("Before =", locationF);
            setLocationF(val);
            console.log("After Change =", locationF);
        } else if (id === "cca") {
            console.log("Before =", ccaF);
            setCCAF(val);
            console.log("After =", ccaF);
        } else if (id === "subjects") {
            console.log("Before =", subjectF);
            let idx = subjectF.indexOf(val);
            let validIdx = validTerm(id, val);
            // check if already in Subject filter and if typed input is valid
            if (idx === -1 && validIdx !== -1) {
                console.log("Valid");
                subjectF.push(subjects[validIdx]);
            } else if (validIdx !== -1 && idx !== -1) {
                console.log("Already filtered");
            }
            // TODO: Delete from multi-filters
            // subjectF.splice(idx, 1);

            setSubjectF(subjectF);
            console.log("After =", subjectF);
        } else if (id === "electives") {
            console.log("Before =", electiveF);
            let idx = electiveF.indexOf(val);
            let validIdx = validTerm(id, val);
            // check if already in Elective filter and if typed input is valid
            if (idx === -1 && validIdx !== -1) {
                console.log("Valid");
                electiveF.push(electives[validIdx]);
            } else if (validIdx !== -1 && idx !== -1) {
                console.log("Already filtered");
            }
            // TODO: Delete from multi-filters
            // subjectF.splice(idx, 1);

            setElectiveF(electiveF);
            console.log("After =", electiveF);
        } else if (id === "min") {
            console.log("Before =", minF);
            setMinF(val);
            console.log("After Change =", minF);
        } else if (id === "max") {
            console.log("Before =", maxF);
            setMaxF(val);
            console.log("After Change =", maxF);
        }
    }

    // TODO: Disable filters when fetchData() not completed yet!

    function handleClick(e) {
        console.log("Entering HANDLE CLICK");

        let id = e.target.id;
        let val = e.target.value;
        if (id === "location") {
            setLocationF(val);
            console.log("After click =", locationF);
            if (val !== "") {
                toggleFilterAdd(id, val);
            } else {
                console.log("Clicked on select =", val);
            }
        } else if (id === "cca") {
            setLocationF(val);
            console.log("After click =", ccaF);
        } else if (id === "min") {
            setMinF(val);
            console.log("After click =", minF);
        } else if (id === "max") {
            setMaxF(val);
            console.log("After click =", maxF);
        }
    }

    return (
        <form id="school-filters">
            <div className="accordian" id="filterSections">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="false"
                            aria-controls="collapseOne"
                        >
                            Location
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#filterSections"
                    >
                        <div className="accordion-body">
                            <label htmlFor="location">Location</label>
                            <select
                                className="form-select"
                                id="location"
                                value={locationF}
                                onChange={handleChange}
                                onClick={handleClick}
                            >
                                <option value="">Select an area</option>
                                {districts.map(function (district) {
                                    return (
                                        <option value={district} key={district}>
                                            {titleCase(district)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                        >
                            Co-curricular Activities
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#filterSections"
                    >
                        <div className="accordion-body">
                            <label htmlFor="cca" className="form-label">
                                CCAs
                            </label>
                            {/* TODO: Add specific CCA name search */}
                            <select
                                className="form-select"
                                id="cca"
                                onChange={handleChange}
                                onClick={handleClick}
                            >
                                <option value="">All categories</option>
                                {ccaGrps?.map(function (ccaGrp) {
                                    return (
                                        <option value={ccaGrp} key={ccaGrp}>
                                            {titleCase(ccaGrp)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseThree"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                        >
                            Subjects
                        </button>
                    </h2>
                    <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#filterSections"
                    >
                        <div className="accordion-body">
                            <label htmlFor="subjects" className="form-label">
                                Subjects
                            </label>
                            <input
                                className="form-control"
                                list="subjectOptions"
                                id="subjects"
                                placeholder="Search for subjects"
                                onChange={handleChange}
                            />
                            <datalist id="subjectOptions">
                                {subjects?.map(function (subj) {
                                    return (
                                        <option
                                            value={titleCase(subj)}
                                            key={subj}
                                        ></option>
                                    );
                                })}
                            </datalist>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFour"
                            aria-expanded="false"
                            aria-controls="collapseFour"
                        >
                            Electives & Programmes
                        </button>
                    </h2>
                    <div
                        id="collapseFour"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingFour"
                        data-bs-parent="#filterSections"
                    >
                        <div className="accordion-body">
                            <label htmlFor="electives" className="form-label">
                                Electives & Programmes
                            </label>
                            <input
                                className="form-control"
                                list="electiveOptions"
                                id="electives"
                                placeholder="Search for electives or programmes"
                                onChange={handleChange}
                            />
                            <datalist id="electiveOptions">
                                {electives?.map(function (elec) {
                                    return (
                                        <option
                                            value={titleCase(elec)}
                                            key={elec}
                                        ></option>
                                    );
                                })}
                            </datalist>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFive"
                            aria-expanded="false"
                            aria-controls="collapseFive"
                        >
                            PSLE score range
                        </button>
                    </h2>
                    <div
                        id="collapseFive"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingFive"
                        data-bs-parent="#filterSections"
                    >
                        <div className="accordion-body">
                            <label htmlFor="scoreRange" className="form-label">
                                PSLE Score
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">From</span>
                                <select
                                    className="form-select"
                                    id="min"
                                    onChange={handleChange}
                                    onClick={handleClick}
                                >
                                    {[...Array(29).keys()].map((i) => {
                                        return (
                                            <option value={i + 4} key={i + 4}>
                                                {i + 4}
                                            </option>
                                        );
                                    })}
                                </select>
                                <span className="input-group-text">To</span>
                                <select
                                    className="form-select"
                                    id="max"
                                    onChange={handleChange}
                                    onClick={handleClick}
                                >
                                    {[...Array(29).keys()]
                                        .reverse()
                                        .map((i) => {
                                            return (
                                                <option
                                                    value={i + 4}
                                                    key={i + 4}
                                                >
                                                    {i + 4}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingSix">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseSix"
                            aria-expanded="false"
                            aria-controls="collapseSix"
                        >
                            School type
                        </button>
                    </h2>
                    <div
                        id="collapseSix"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingSix"
                        data-bs-parent="#filterSections"
                    >
                        <div className="accordion-body">
                            <div className="mb-3">
                                <label className="form-label">Gender</label>
                                {genders.map((item) => {
                                    return (
                                        <div className="form-check" key={item}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={item}
                                                id={item}
                                                onClick={(e) => {
                                                    let temp = genderF;
                                                    temp[item] = !temp[item];
                                                    setGenderF(temp);
                                                    console.log(
                                                        "Gender =",
                                                        genderF
                                                    );
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={item}
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                {types.map((item) => {
                                    return (
                                        <div className="form-check" key={item}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={item}
                                                id={item}
                                                onClick={(e) => {
                                                    let temp = typeF;
                                                    temp[item] = !temp[item];
                                                    setTypeF(temp);
                                                    console.log(
                                                        "Type =",
                                                        typeF
                                                    );
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={item}
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Others</label>
                                {others.map((item) => {
                                    return (
                                        <div className="form-check" key={item}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={item}
                                                id={item}
                                                onClick={(e) => {
                                                    let temp = otherF;
                                                    temp[item] = !temp[item];
                                                    setOtherF(temp);
                                                    console.log(
                                                        "Other =",
                                                        otherF
                                                    );
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={item}
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default SchoolsFilter;
