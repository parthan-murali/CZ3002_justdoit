import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import SecFiltersContext from "../Contexts/SecFiltersContext.js";
import "../PagesCSS/Dashboard/Dashboard.css";
import {
    auth, //db,
    updateStudentProfile,
    getStudentProfile,
} from "../Firebase";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";
import data from "../JSON/combined_data.json";

function RecommendCard() {
    const [currentUser, isLoading /* , err*/] = useAuthState(auth);
    const [uid, setUid] = useState("");
    const [name, setName] = useState("name");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(
        "https://ouch-cdn2.icons8.com/PCj6WwNF1xmJ2kHeHjum0n0U1ZH2kmItggiXJKO0WR8/rs:fit:912:912/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNTYv/NDk2NmFiM2UtNjFk/MS00MjJhLTk2N2Mt/ODhkMmY0NTdiNTIz/LnBuZw.png"
    );
    const [photoURL, setPhotoURL] = useState(null);
    const [password, setPassword] = useState("");
    const [level, setLevel] = useState("");
    const [score, setScore] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [genderF, setGenderF] = useState({
        Boys: false,
        Girls: false,
        Mixed: true,
    });

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState(false);

    const secFiltersCtx = useContext(SecFiltersContext);

    const parsedData = JSON.parse(JSON.stringify(data));

    let schools = [];

    async function fetchData() {
        if (currentUser) {
            setUid(currentUser.uid);
            setName(currentUser.displayName);
            setEmail(currentUser.email);
            if (currentUser.photoURL) {
                setPhoto(currentUser.photoURL);
                setPhotoURL(currentUser.photoURL);
            }
            console.log(
                "currentUser, name, email, status, photoURL, photo",
                currentUser,
                name,
                email,
                photoURL,
                photo
            );
            await getStudentProfile(
                setLoading,
                setLevel,
                setScore,
                setAddress,
                setGenderF,
                setGender
            );
            // setLoading(true);
            // if (genderF.Boys) {
            //     setGender("Boys");
            // } else if (genderF.Girls) {
            //     setGender("Girls");
            // }
            // console.log("Gender =", gender);
            // setLoading(false);
        }
        // if (currentUser?.photoURL) {
        //   setPhoto(currentUser.photoURL);
        //   setPhotoURL(currentUser.photoURL);
        // }
        else {
            console.log("no photoURl");
        }
    }

    useEffect(() => {
        let isSubscribed = true;
        console.log("in useEffect");
        if (isLoading || loading) {
            console.log("in useEffect: isLoading");
            return;
        }
        if (!currentUser) {
            toast("Please log in to view dashboard", { type: "info" });
            navigate("/login");
        }
        if (isSubscribed) {
            fetchData();
        }
        return () => (isSubscribed = false);
    }, [currentUser, isLoading, uid]);

    function toggleFilterAdd(filter, value) {
        console.log("RecommendCard > toggleFilterAdd");
        secFiltersCtx.addFilter(filter, value);
    }

    function toggleFilterRemove(filter, value) {
        console.log("RecommendCard > toggleFilterRemove");
        secFiltersCtx.removeFilter(filter, value);
    }

    function toggleFilterReset() {
        console.log("RecommendCard > toggleFilterReset");
        secFiltersCtx.resetFilters();
    }
    function cacheSchools() {
        if (parsedData !== undefined) {
            // filter to get primary school data
            let index = 0; // to ensure the school appear in numeric order, using i will skip some numbers
            if (level === "SECONDARY") {
                for (let i = 0; i < parsedData.length; i++) {
                    if (
                        parsedData[i].mainlevel_code === "SECONDARY" ||
                        parsedData[i].mainlevel_code === "MIXED LEVELS"
                    ) {
                        schools[index++] = parsedData[i];
                    }
                }
            } else if (level === "PRIMARY") {
                for (let i = 0; i < parsedData.length; i++) {
                    if (
                        parsedData[i].mainlevel_code === "PRIMARY" ||
                        parsedData[i].school_name
                            .toLowerCase()
                            .includes("NICHOLAS".toLowerCase())
                    ) {
                        schools[index++] = parsedData[i];
                    }
                }
            } else if (level === "JC") {
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
        }
        localStorage.setItem("schools", JSON.stringify(schools));
    }

    function getRecommended() {
        cacheSchools();
        toggleFilterReset();
        let val = [];
        Object.keys(genderF).forEach((key) => {
            if (genderF[key]) {
                val.push(key);
            }
        });
        toggleFilterAdd("genders", val);
        if (level === "PRIMARY") {
            if (address !== "") {
                toggleFilterAdd("address", address);
                navigate("/recommended", {
                    state: { level: "PRIMARY", sort: "Proximity" },
                });
                return;
            }
        }
        if (level === "SECONDARY") {
            if (score !== "") {
                toggleFilterAdd("min", score);
                toggleFilterAdd("max", score);
                navigate("/recommended", {
                    state: { level: "SECONDARY", sort: "Rank" },
                });
                return;
            }
        }
        if (level === "JC") {
            if (score !== "") {
                toggleFilterAdd("l1r5", score);
                navigate("/recommended", {
                    state: { level: "JC", sort: "Rank" },
                });
                return;
            }
        }
        toast("One of the fields - Level, Score, Address - was not saved", {
            type: "error",
        });
    }

    async function handleSave() {
        console.log("Updating student profile...");
        await updateStudentProfile(level, score, address, genderF, setLoading)
            .then(() => {
                toast("Changes saved", { type: "success" });
                return;
            })
            .catch((err) => {
                console.log("updateStudentProfile error: ", err.message);

                toast("Error updating student profile", { type: "error" });
            });
        return 1;
    }

    function handleChange(e) {
        const id = e.target.id;

        let temp = genderF;
        if (id === "Boys") {
            temp.Boys = true;
            temp.Girls = false;
        } else if (id === "Girls") {
            temp.Boys = false;
            temp.Girls = true;
        }

        setGenderF(temp);
        console.log("Gender =", genderF);
    }

    return (
        <div className="card mx-5 p-5 d-flex flex-column">
            <div className="d-flex flex-column align-items-start">
                <div className="m-3">
                    <label className="form-label h6">
                        What level of education are you<br></br>pursuing next?
                    </label>
                    <div>
                        <div className="form-check text-start">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="level"
                                id="primary"
                                value="PRIMARY"
                                onChange={(e) => setLevel(e.target.value)}
                                checked={level === "PRIMARY" ? true : false}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="primary"
                            >
                                Primary
                            </label>
                        </div>
                        <div className="form-check text-start">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="level"
                                id="secondary"
                                value="SECONDARY"
                                onChange={(e) => setLevel(e.target.value)}
                                checked={level === "SECONDARY" ? true : false}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="secondary"
                            >
                                Secondary
                            </label>
                        </div>
                        <div className="form-check text-start">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="level"
                                id="jc"
                                value="JC"
                                onChange={(e) => setLevel(e.target.value)}
                                checked={level === "JC" ? true : false}
                            />
                            <label className="form-check-label" htmlFor="jc">
                                Junior College
                            </label>
                        </div>
                    </div>
                </div>

                {level === "SECONDARY" && (
                    <div className="m-3">
                        <label htmlFor="score" className="form-label h6">
                            Please input your PSLE score:
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="score"
                            min="4"
                            max="32"
                            placeholder="PSLE Score"
                            value={score !== "" ? score : ""}
                            onChange={(e) => setScore(e.target.value)}
                        />
                    </div>
                )}

                {level === "JC" && (
                    <div className="m-3">
                        <label htmlFor="score" className="form-label h6">
                            Please input your L1R5 score:
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="score"
                            min="4"
                            max="20"
                            placeholder="L1R5 Score"
                            value={score !== "" ? score : ""}
                            onChange={(e) => setScore(e.target.value)}
                        />
                    </div>
                )}

                <div className="m-3">
                    <label htmlFor="address" className="form-label h6">
                        Please input your postal code:
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="address"
                        placeholder="Postal Code"
                        value={address !== "" ? address : ""}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <div id="addressHelp" className="form-text">
                        Optional if you are not searching for a Primary School.
                    </div>
                </div>

                <div className="m-3">
                    <label htmlFor="gender" className="form-label h6">
                        Gender:
                    </label>
                    <div className="form-check text-start">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="Girls"
                            value="Female"
                            onChange={(e) => {
                                handleChange(e);
                                setGender("Girls");
                            }}
                            checked={gender === "Girls" ? true : false}
                        />
                        <label className="form-check-label" htmlFor="Girls">
                            Female
                        </label>
                    </div>
                    <div className="form-check text-start">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="Boys"
                            value="Male"
                            onChange={(e) => {
                                handleChange(e);
                                setGender("Boys");
                            }}
                            checked={gender === "Boys" ? true : false}
                        />
                        <label className="form-check-label" htmlFor="Boys">
                            Male
                        </label>
                    </div>
                </div>
            </div>
            <button
                disabled={loading}
                onClick={async () => {
                    const saved = await handleSave();
                    if (saved) {
                        getRecommended();
                    }
                }}
                className="btn btn-primary m-3"
            >
                View Recommendations
            </button>
        </div>
    );
}
export default RecommendCard;
