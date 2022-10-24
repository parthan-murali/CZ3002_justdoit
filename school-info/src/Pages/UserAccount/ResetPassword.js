import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../Firebase";
import "../../PagesCSS/Reset.css";
import BackgroundParticle from "../../Components/BackgroundParticle";
function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="reset">
      <BackgroundParticle />
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
          Reset password with email
        </button>
        <div>
          Don't have an account?{" "}
          <Link to="/SignUp" className="register__now">
            Register
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}
export default Reset;
