import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
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
  // ORIGINAL
  // const fetchUserName = async () => {
  //   try {
  //     const q = query(collection(db, "users"), where("uid", "==", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();
  //     setName(data.name);
  //   } catch (err) {
  //     console.error(err);
  //     alert("An error occured while fetching user data");
  //   }
  // };
  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return navigate("/");
  //   fetchUserName();
  // }, [user, loading]);
  // END ORIGINAL

  //   const getUserData = () => {
  //     setLoading(true);
  //   try {
  //     setName(currentUser.displayName);
  //     console.log("currentUser.displayName: ", currentUser.displayName);
  //     setEmail(currentUser.email);
  //     setPhoto(currentUser.photoURL);
  //     setPhotoURL(currentUser.photoURL);
  //     console.log("photoURL, photo:", photoURL, photo);
  //   } catch (err) {
  //     console.error(err);
  //     alert("An error occured while fetching user data");
  //   }
  //   setLoading(false);
  // };

  function fetchData() {
    if (currentUser) {
      setUid(currentUser.uid);
      setName(currentUser.displayName);
      setEmail(currentUser.email);
      if (currentUser.photoURL) {
        setPhoto(currentUser.photoURL);
        setPhotoURL(currentUser.photoURL);
      }
      console.log(
        "currentUser, name, email, status, photoURL, photo:",
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
    if (isSubscribed) fetchData();
    return () => (isSubscribed = false);
  }, [currentUser, isLoading, uid]);

  function handleChangePhoto(e) {
    if (e.target.files[0]) {
      setPhotoURL(e.target.files[0]);
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  }

  function sendEmail() {
    if (currentUser.emailVerified) toast("Account already verified.", { type: "success" })
    else {
      sendEmailVerification(currentUser)
        .then(() => {
          toast("Verification Email sent.", { type: "success" });
        })
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
        console.log("loading, photoURL, photo:", loading, photoURL, photo);
        if (!loading && typeof photoURL == "object" && photoURL !== null) {
          console.log("Updating photo...");
          updatePhoto(photoURL, setLoading);
        }
        toast("Changes saved", { type: "success" });
        return;
      })
      .catch((err) => {
        console.log("updateEmail (Authentication) error: ", err.message);
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

  if (!currentUser) {
    navigate("/login")
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
          {currentUser &&
            <p>
              {
                currentUser.emailVerified ? "Email Verified" : "Email Not Verified"
              }
            </p>}
        </div>

        <input
          type="text"
          value={name == null ? "" : name}
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
