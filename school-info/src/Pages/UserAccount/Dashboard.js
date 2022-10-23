import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import SecFiltersContext from "../../Contexts/SecFiltersContext";
import Modal from "../../Components/Modal.js";
import "../../PagesCSS/Dashboard/Dashboard.css";
import {
    auth, //db,
    logout,
    updateName,
    updatePhoto,
    updateUserEmail,
    updateStudentProfile,
    getStudentProfile,
    deleteAccount,
    reauthenticate,
} from "../../Firebase";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";
function Dashboard() {
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

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState(false);

    const secFiltersCtx = useContext(SecFiltersContext);

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
            await getStudentProfile(setLoading, setLevel, setScore, setAddress);
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
            console.log(
                "level =",
                level,
                "score =",
                score,
                "address =",
                address
            );
        }
        return () => (isSubscribed = false);
    }, [currentUser, isLoading, uid]);

    function toggleFilterAdd(filter, value) {
        console.log("Dashboard > toggleFilterAdd");
        secFiltersCtx.addFilter(filter, value);
    }

    function toggleFilterRemove(filter, value) {
        console.log("Dashboard > toggleFilterRemove");
        secFiltersCtx.removeFilter(filter, value);
    }

    function toggleFilterReset() {
        console.log("Dashboard > toggleFilterReset");
        secFiltersCtx.resetFilters();
    }

    function getRecommended() {
        toggleFilterReset();
        if (level === "SECONDARY") {
            if (score !== "") {
                toggleFilterAdd("min", score);
                toggleFilterAdd("max", score);
                secFiltersCtx.setRecDone(false);
                navigate("/schools/secondary", { state: { sort: "Rank" } });
                return;
            }
        }
        toast("One of the fields - Level, Score, Address - was not saved", {
            type: "error",
        });
    }

    function handleChangePhoto(e) {
        if (e.target.files[0]) {
            setPhotoURL(e.target.files[0]);
            setPhoto(URL.createObjectURL(e.target.files[0]));
        }
    }

    function sendEmail() {
        if (currentUser.emailVerified)
            toast("Account already verified.", { type: "success" });
        else {
            sendEmailVerification(currentUser).then(() => {
                toast("Verification Email sent.", { type: "success" });
            });
        }
    }

    function displayModal() {
        console.log("in displayModal");
        setModalOpen(true);
    }

    async function handleSave() {
        if (
            name === "" ||
            name.replace(/\s/g, "") === "" ||
            email === "" ||
            email.replace(/\s/g, "") === ""
        ) {
            toast("Do not leave name and/or email fields empty.", {
                type: "warning",
            });
            return;
        }
        await updateUserEmail(email)
            .then(() => {
                console.log("Updating name...");
                updateName(name, setLoading);
                console.log(
                    "loading, photoURL, photo:",
                    loading,
                    photoURL,
                    photo
                );
                if (
                    !loading &&
                    typeof photoURL == "object" &&
                    photoURL !== null
                ) {
                    console.log("Updating photo...");
                    updatePhoto(photoURL, setLoading);
                }
            })
            .catch((err) => {
                console.log(
                    "updateEmail (Authentication) error: ",
                    err.message
                );
                if (err.code === "auth/requires-recent-login") {
                    displayModal();
                } else {
                    toast(err.message, { type: "error" });
                }
            });

        console.log("Updating student profile...");
        await updateStudentProfile(level, score, address, setLoading)
            .then(() => {
                toast("Changes saved", { type: "success" });
                return;
            })
            .catch((err) => {
                console.log("updateStudentProfile error: ", err.message);

                toast("Error updating student profile", { type: "error" });
            });
    }

    useEffect(() => {
        console.log("toDelete:", toDelete);
        if (modalOpen) {
            return;
        } else if (!modalOpen && password !== "") {
            reauthenticate(password)
                .then(() => {
                    if (!toDelete) {
                        console.log("Retry save...");
                        handleSave();
                    } else {
                        deleteAccount(setLoading);
                        setToDelete(false);
                    }
                })
                .catch((err) => toast(err.message, { type: "error" }));
            setPassword("");
        }
    }, [modalOpen]);

    function changePwd() {
        navigate("/changePassword");
    }

    function handleDelete() {
        const confirmDelete = window.confirm(
            "Are you sure you wish to delete your account?"
        );

        if (confirmDelete) {
            setToDelete(true);
            displayModal();
        }
    }

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                <span className="dashboard-details">Dashboard</span>
                {/* <div>{name}</div>
        <div>{currentUser?.email}</div> */}
                <button className="dashboard-logout-btn" onClick={logout}>
                    Logout
                </button>

                <div>
                    <input
                        type="file"
                        onChange={handleChangePhoto}
                        className="dashboard-attachment"
                    />
                    <img src={photo} alt="Avatar" className="dashboard-img" />
                </div>

                <div>
                    {currentUser && (
                        <p>
                            {currentUser.emailVerified
                                ? "Email Verified"
                                : "Email Not Verified"}
                        </p>
                    )}
                </div>

                <input
                    type="text"
                    value={name === null ? "" : name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="dashboard-name"
                />
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                    className="dashboard-email"
                />

                <div className="m-3">
                    <label className="form-label h6">
                        What level of education are you pursuing next?
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

                <div className="m-3">
                    <label htmlFor="address" className="form-label h6">
                        Please input your postal code:
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="address"
                        placeholder="Postal Code"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    onClick={() => {
                        handleSave();
                    }}
                    className="dashboard-buttons"
                >
                    Save Changes
                </button>

                <button
                    disabled={loading}
                    onClick={() => {
                        getRecommended();
                    }}
                    className="dashboard-buttons"
                >
                    Get Recommendations
                </button>

                <button
                    disabled={loading}
                    onClick={changePwd}
                    className="dashboard-buttons"
                >
                    Change Password
                </button>

                <button
                    disabled={loading}
                    onClick={sendEmail}
                    className="dashboard-buttons"
                >
                    Resend Verification Email
                </button>

                <button
                    disabled={loading}
                    onClick={() => {
                        handleDelete();
                    }}
                    className="dashboard-buttons"
                >
                    Delete Account
                </button>
            </div>
            {modalOpen && (
                <Modal
                    setOpenModal={setModalOpen}
                    setPassword={setPassword}
                    setToDelete={setToDelete}
                />
            )}
        </div>
    );
}
export default Dashboard;
