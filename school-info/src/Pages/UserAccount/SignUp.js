import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../../Firebase";
import { sendEmailVerification } from "firebase/auth";
import "../../PagesCSS/SignUp.css";
import BackgroundParticle from "../../Components/BackgroundParticle";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading /*, error*/] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const register = () => {
    if (!name || name.replace(/\s/g, "") === "") alert("Please enter name");
    else registerWithEmailAndPassword(name, email, password, setIsLoading);
  };
  useEffect(() => {
    if (loading || isLoading) return;
    if (user) {
      navigate("/dashboard", { replace: true });
      sendEmailVerification(user).then(() => {
        toast(
          "Verification Email sent. Please verify your email before proceeding.",
          { type: "success" }
        );
      });
    }
  }, [user, loading, isLoading, navigate]);

  return (
    <div className="register">
      <BackgroundParticle />
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="register__btn"
          onClick={register}
          disabled={isLoading || loading}
        >
          Register
        </button>
        <div>
          Already have an account?{" "}
          <Link to="/login" className="login__now">
            Login
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}
export default Register;
