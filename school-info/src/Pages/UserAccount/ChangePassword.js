import React, { useState } from "react";
import { auth, reauthenticate } from "../../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../../PagesCSS/Login.css";
import { toast } from "react-toastify";
import { updatePassword } from "firebase/auth";
import BackgroundParticle from "../../Components/BackgroundParticle";

function ChangePassword(){

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentUser, loading] = useAuthState(auth);
    
    const changeOnClick = () => {
        reauthenticate(currentPassword).then(() => {
            updatePassword(currentUser, newPassword).then(() => {
                toast("Password was changed.", { type: "success" });
            }).catch((error) => { 
                toast(error.message, { type: "error" });
            });
        }).catch((error) => { toast(error.message, { type: "error" }); });
    }

    return (
    <div className="login">
        <BackgroundParticle />
        <div className="login__container">
            <input
             type="password"
             className="login__textBox"
             value={currentPassword}
             onChange={(e) => setCurrentPassword(e.target.value)}
             placeholder="Current Password"
             />
            <input
             type="password"
             className="login__textBox"
             value={newPassword}
             onChange={(e) => setNewPassword(e.target.value)}
             placeholder="New Password"
             />
             <button className="login__btn" onClick={changeOnClick} disabled={loading}>
                 Change Password
             </button>
        </div>;
    </div>
  );
}

export default ChangePassword;