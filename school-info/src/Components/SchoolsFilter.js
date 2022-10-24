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
    const types = () => {
        if (level === "PRIMARY")
            return [
                "Autonomous",
                "Government School",
                "Government-Aided School",
                "Specialised Assistance Plan (SAP)",
            ];
        if (level === "SECONDARY")
            return [
                "Autonomous",
                "Government School",
                "Government-Aided School",
                "Independent School",
                "Specialised Assistance Plan (SAP)",
                "Specialised Independent School",
                "Specialised School",
            ];
        if (level === "JC")
            return [
                "Autonomous",
                "Government School",
                "Government-Aided School",
                "Independent School",
                "Specialised Assistance Plan (SAP)",
                "Specialised Independent School",
            ];
    };
    const others = ["Gifted Education Programme", "Integrated Programme"];

    const [locationF, setLocationF] = useState("");
    const [addressF, setAddressF] = useState("");
    const [ccaF, setCCAF] = useState(new Set());
    const [subjectF, setSubjectF] = useState(new Set());
    const [electiveF, setElectiveF] = useState(new Set());
    const [minF, setMinF] = useState("4");
    const [maxF, setMaxF] = useState("32");
    const [l1r5, setl1r5] = useState("20");
    let genderDict = Object.assign({}, ...genders.map((x) => ({ [x]: false })));
    const [genderF, setGenderF] = useState(genderDict);
    let typeDict = Object.assign({}, ...types().map((x) => ({ [x]: false })));
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
                return inLevel(rec.school_name);
            });
            localStorage.setItem(lvlName + "CCAData", JSON.stringify(ccaData));
            let groups = new Set(
                ccaData.map((rec) => {
                    return rec.cca_generic_name;
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
                lvlName + "SubjectData",
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
                lvlName + "ElectiveData",
                JSON.stringify(electiveData)
            );
            let elecSet = new Set(
                electiveData.map((rec) => {
                    return rec.moe_programme_desc;
                })
            );
            schools.forEach((sch) => {
                if (sch.alp_title.length !== 0 && sch.alp_title[0] !== "NULL") {
                    elecSet.add(sch.alp_title[0].toUpperCase());
                }
                if (
                    sch.llp_title1.length !== 0 &&
                    sch.llp_title1[0] !== "NULL"
                ) {
                    elecSet.add(sch.llp_title1[0].toUpperCase());
                }
                if (
                    sch.llp_title2.length !== 0 &&
                    sch.llp_title2[0] !== "NULL"
                ) {
                    elecSet.add(sch.llp_title2[0].toUpperCase());
                }
            });

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
            console.log("Fetching...");
            fetchData();
            localStorage.setItem("schools", JSON.stringify(schools));
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
        console.log("SchoolsFilter > toggleFilterAdd");
        secFiltersCtx.addFilter(filter, value);
    }

    function toggleFilterRemove(filter, value) {
        console.log("SchoolsFilter > toggleFilterRemove");
        secFiltersCtx.removeFilter(filter, value);
    }

    function toggleFilterReset(filter, value) {
        console.log("SchoolsFilter > toggleFilterReset");
        secFiltersCtx.resetFilters();
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
        let id = e.target.id;
        let val = e.target.value;
        let newSet;

        switch (id) {
            case "location":
                console.log("Before Change:", locationF);
                setLocationF(val);
                console.log("After Change:", locationF);
                toggleFilterRemove("location", locationF);
                toggleFilterAdd("location", locationF);
                break;
            case "address":
                console.log("Got address:", addressF);
                toggleFilterAdd(id, addressF);
            case "ccas":
                // console.log("val =", val);
                if (ccaGrps.includes(val.toUpperCase())) {
                    newSet = ccaF.add(val.toUpperCase());
                    setCCAF(newSet);
                    toggleFilterAdd(id, newSet); // when adding, input the whole array
                }
                break;
            case "subjects":
                if (subjects.includes(val.toUpperCase())) {
                    newSet = subjectF.add(val.toUpperCase());
                    setSubjectF(newSet);
                    toggleFilterAdd(id, newSet); // when adding, input the whole array
                }
                break;
            case "electives":
                if (electives.includes(val.toUpperCase())) {
                    newSet = electiveF.add(val.toUpperCase());
                    setElectiveF(newSet);
                    toggleFilterAdd(id, newSet); // when adding, input the whole array
                }
                break;
            case "min":
                console.log("Before Change:", minF);
                setMinF(val);
                console.log("After Change:", minF);
                toggleFilterRemove("min", minF);
                toggleFilterAdd("min", minF);
                break;
            case "max":
                console.log("Before Change:", maxF);
                setMaxF(val);
                console.log("After Change:", maxF);
                toggleFilterRemove("max", maxF);
                toggleFilterAdd("max", maxF);
                break;
            case "l1r5":
                setl1r5(val);
                toggleFilterRemove(id, l1r5);
                toggleFilterAdd(id, l1r5);
                break;
            default:
                console.log("Default Change");
        }
    }

    function handleClick(id) {
        let val;

        switch (id) {
            case "genders":
                val = [];
                Object.keys(genderF).forEach((key) => {
                    if (genderF[key]) {
                        val.push(key);
                    }
                });
                break;
            case "types":
                val = [];
                Object.keys(typeF).forEach((key) => {
                    if (typeF[key]) {
                        val.push(key);
                    }
                });
                break;
            case "others":
                val = [];
                Object.keys(otherF).forEach((key) => {
                    if (otherF[key]) {
                        val.push(key);
                    }
                });
                break;
            default:
                console.log("Default Click");
        }

        toggleFilterAdd(id, val);
    }

    // TODO: Disable filters when fetchData() not completed yet!

    return (
        <form id="school-filters" className="sidebar">
            <div className="d-flex justify-content-end my-3">
                <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={toggleFilterReset}
                >
                    Clear all
                </button>
            </div>

            <div className="accordian" id="filterSections">
                <div className="accordion-item">
                    <div className="card">
                        <div className="card-header p-3">
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
                        </div>
                        <div
                            id="collapseOne"
                            className="accordion-collapse collapse m-3"
                            aria-labelledby="headingOne"
                            data-bs-parent="#filterSections"
                        >
                            <div className="accordion-body">
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="form-label"
                                    >
                                        Search for schools by area
                                    </label>
                                    <select
                                        className="form-select"
                                        id="location"
                                        value={locationF}
                                        onChange={(e) => {
                                            setLocationF(e.target.value);
                                        }}
                                        onClick={handleChange}
                                    >
                                        <option value="">Select an area</option>
                                        {districts.map(function (district) {
                                            return (
                                                <option
                                                    value={district}
                                                    key={district}
                                                >
                                                    {titleCase(district)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label
                                        htmlFor="address"
                                        className="form-label"
                                    >
                                        Search for schools near you
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="address"
                                        placeholder="Enter your postal code"
                                        onChange={(e) => {
                                            setAddressF(e.target.value);
                                            handleChange(e);
                                        }}
                                    />
                                    <div id="addressHelp" className="form-text">
                                        To view schools nearest to you, sort by
                                        Proximity.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <div className="card">
                        <div className="card-header p-3">
                            <h2 className="accordion-header" id="headingTwo">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseTwo"
                                >
                                    Co-curricular Activities (CCAs)
                                </button>
                            </h2>
                        </div>
                        <div
                            id="collapseTwo"
                            className="accordion-collapse collapse m-3"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#filterSections"
                        >
                            <div className="accordion-body">
                                {/* <label htmlFor="ccas" className="form-label">
                                    CCAs
                                </label> */}
                                <input
                                    className="form-control"
                                    list="ccaOptions"
                                    id="ccas"
                                    placeholder="Search for CCAs"
                                    onChange={handleChange}
                                />
                                <datalist id="ccaOptions">
                                    {ccaGrps?.map(function (cca) {
                                        return (
                                            <option
                                                value={titleCase(cca)}
                                                key={cca}
                                            ></option>
                                        );
                                    })}
                                </datalist>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <div className="card">
                        <div className="card-header p-3">
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
                        </div>
                        <div
                            id="collapseThree"
                            className="accordion-collapse collapse m-3"
                            aria-labelledby="headingThree"
                            data-bs-parent="#filterSections"
                        >
                            <div className="accordion-body">
                                {/* <label
                                    htmlFor="subjects"
                                    className="form-label"
                                >
                                    Subjects
                                </label> */}
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
                </div>
                <div className="accordion-item">
                    <div className="card">
                        <div className="card-header p-3">
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
                        </div>
                        <div
                            id="collapseFour"
                            className="accordion-collapse collapse m-3"
                            aria-labelledby="headingFour"
                            data-bs-parent="#filterSections"
                        >
                            <div className="accordion-body">
                                {/* <label
                                    htmlFor="electives"
                                    className="form-label"
                                >
                                    Electives & Programmes
                                </label> */}
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
                </div>
                {level === "SECONDARY" && (
                    <div className="accordion-item">
                        <div className="card">
                            <div className="card-header p-3">
                                <h2
                                    className="accordion-header"
                                    id="headingFive"
                                >
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
                            </div>
                            <div
                                id="collapseFive"
                                className="accordion-collapse collapse m-3"
                                aria-labelledby="headingFive"
                                data-bs-parent="#filterSections"
                            >
                                <div className="accordion-body">
                                    {/* <label
                                    htmlFor="scoreRange"
                                    className="form-label"
                                >
                                    PSLE Score
                                </label> */}
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            From
                                        </span>
                                        <select
                                            className="form-select"
                                            id="min"
                                            onChange={(e) => {
                                                setMinF(e.target.value);
                                            }}
                                            onClick={handleChange}
                                        >
                                            {[...Array(29).keys()].map((i) => {
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
                                        <span className="input-group-text">
                                            To
                                        </span>
                                        <select
                                            className="form-select"
                                            id="max"
                                            onChange={(e) => {
                                                setMaxF(e.target.value);
                                            }}
                                            onClick={handleChange}
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
                    </div>
                )}
                {level === "JC" && (
                    <div className="accordion-item">
                        <div className="card">
                            <div className="card-header p-3">
                                <h2
                                    className="accordion-header"
                                    id="headingFive"
                                >
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseFive"
                                        aria-expanded="false"
                                        aria-controls="collapseFive"
                                    >
                                        O-Level L1R5
                                    </button>
                                </h2>
                            </div>
                            <div
                                id="collapseFive"
                                className="accordion-collapse collapse m-3"
                                aria-labelledby="headingFive"
                                data-bs-parent="#filterSections"
                            >
                                <div className="accordion-body">
                                    {/* <label
                                    htmlFor="scoreRange"
                                    className="form-label"
                                >
                                    PSLE Score
                                </label> */}
                                    <div className="input-group">
                                        <select
                                            className="form-select"
                                            id="l1r5"
                                            onChange={(e) => {
                                                setl1r5(e.target.value);
                                            }}
                                            onClick={handleChange}
                                        >
                                            {[...Array(17).keys()]
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
                    </div>
                )}
                <div className="accordion-item">
                    <div className="card">
                        <div className="card-header p-3">
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
                        </div>
                        <div
                            id="collapseSix"
                            className="accordion-collapse collapse m-3"
                            aria-labelledby="headingSix"
                            data-bs-parent="#filterSections"
                        >
                            <div className="accordion-body">
                                <div className="mb-3">
                                    <label className="form-label">Gender</label>
                                    {genders.map((item) => {
                                        return (
                                            <div
                                                className="form-check"
                                                key={item}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item}
                                                    name="gender"
                                                    id={item}
                                                    onClick={(e) => {
                                                        let temp = genderF;
                                                        temp[item] =
                                                            !temp[item];
                                                        setGenderF(temp);
                                                        console.log(
                                                            "Gender =",
                                                            genderF
                                                        );
                                                        handleClick("genders");
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
                                    {types().map((item) => {
                                        let disable = false;
                                        for (const [
                                            key,
                                            value,
                                        ] of Object.entries(typeF)) {
                                            if (key !== item && value) {
                                                disable = true;
                                            }
                                        }
                                        if (
                                            item === "Autonomous" ||
                                            item ===
                                                "Specialised Assistance Plan (SAP)"
                                        ) {
                                            disable = false;
                                        }
                                        return (
                                            <div
                                                className="form-check"
                                                key={item}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item}
                                                    name="type"
                                                    id={item}
                                                    disabled={disable}
                                                    onClick={(e) => {
                                                        let temp = typeF;
                                                        temp[item] =
                                                            !temp[item];
                                                        setTypeF(temp);
                                                        console.log(
                                                            "Type =",
                                                            typeF
                                                        );
                                                        handleClick("types");
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
                                            <div
                                                className="form-check"
                                                key={item}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item}
                                                    name="other"
                                                    id={item}
                                                    onClick={(e) => {
                                                        let temp = otherF;
                                                        temp[item] =
                                                            !temp[item];
                                                        setOtherF(temp);
                                                        console.log(
                                                            "Other =",
                                                            otherF
                                                        );
                                                        handleClick("others");
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
            </div>
        </form>
    );
}

export default SchoolsFilter;
