import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import RecommendCard from "../../Components/RecommendCard";
import Modal from "../../Components/Modal.js";
import "../../PagesCSS/Dashboard/Dashboard.css";
import {
    auth, //db,
    logout,
    updateName,
    updatePhoto,
    updateUserEmail,
    deleteAccount,
    reauthenticate,
} from "../../Firebase";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";
import {
    faCircleCheck,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState(false);
    const [view, setView] = useState("default");
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

    useEffect(() => {}, [view]);

    function display() {
        if (view === "recommendations") {
            console.log("Showing RecommendCard");
            return <RecommendCard />;
        } else {
            return (
                <div className="card mx-5 p-5 d-flex flex-column">
                    <div className="d-flex flex-column align-items-center">
                        <img
                            src={photo}
                            className="rounded-circle dbd-avatar"
                            alt="Avatar"
                        />
                    </div>

                    <div className="d-flex flex-column m-3">
                        <label htmlFor="avatar" className="form-label">
                            Change photo
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            onChange={handleChangePhoto}
                            id="avatar"
                        />
                    </div>
                    <div className="d-flex align-items-start">
                        <div className="m-3">
                            <label htmlFor="dispName" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name === null ? "" : name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name"
                                className="form-control"
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="email" className="form-label">
                                E-mail Address
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Valid e-mail address"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        onClick={handleSave}
                        className="btn btn-primary m-3"
                    >
                        Save
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="d-flex flex-column p-5 align-items-center">
            <div className="d-flex m-3 justify-content-center">
                <div className="d-flex flex-column align-items-end">
                    <div className="dbd-sidebar">
                        <div>
                            <h1 className="dbd-title">Dashboard</h1>
                        </div>
                        <div className="list-group my-4">
                            <button
                                type="button"
                                className={
                                    view === "default"
                                        ? "list-group-item list-group-item-action active"
                                        : "list-group-item list-group-item-action"
                                }
                                onClick={() => {
                                    setView("default");
                                }}
                            >
                                Edit Profile
                            </button>
                            <button
                                type="button"
                                className={
                                    view === "recommendations"
                                        ? "list-group-item list-group-item-action active"
                                        : "list-group-item list-group-item-action"
                                }
                                onClick={() => {
                                    setView("recommendations");
                                }}
                            >
                                Get Recommendations
                            </button>
                            <button
                                type="button"
                                className="list-group-item list-group-item-action"
                                disabled={loading}
                                onClick={changePwd}
                            >
                                Change Password
                            </button>
                            <button
                                type="button"
                                className="list-group-item list-group-item-action"
                                disabled={loading}
                                onClick={sendEmail}
                            >
                                Resend Verification Email
                            </button>
                            <button
                                type="button"
                                className="list-group-item list-group-item-action"
                                disabled={loading}
                                onClick={handleDelete}
                            >
                                Delete Account
                            </button>
                            <button
                                type="button"
                                className="list-group-item list-group-item-action"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>

                        <div>
                            {currentUser && currentUser.emailVerified ? (
                                <div
                                    className="alert alert-info p-2"
                                    role="alert"
                                >
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        size="sm"
                                    ></FontAwesomeIcon>
                                    &nbsp; Email verified
                                </div>
                            ) : (
                                <div
                                    className="alert alert-warning p-2"
                                    role="alert"
                                >
                                    <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                        size="sm"
                                    ></FontAwesomeIcon>
                                    &nbsp; Email not verified
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {display()}
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
