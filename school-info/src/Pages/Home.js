import React from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/Home/Home.css";
import pic1 from "../PagesCSS/Home/choose.png";
import pic2 from "../PagesCSS/Home/search.png";

function Home() {
  return (
    <section>
      <div className="home-section1">
        <h1 className="home-heading1">
          Tough time finding<br></br>the right schools?
        </h1>
        <p className="home-description1">
          With SchoolCompare, you can find the perfect school<br></br>for you or
          your child in the nick of time.
        </p>
        <img src={pic1} alt="Choose" className="home-img1" />
      </div>
      <div className="home-section2">
        <div>
          <h2 className="home-heading2">
            All the information you need in just a few clicks.
          </h2>
          <p className="home-description2">
            Start navigating different{" "}
            <Link to="/schools" className="home-link2">
              Schools
            </Link>{" "}
            and add potential schools to your{" "}
            <Link to="/favourites" className="home-link2">
              Favourites
            </Link>{" "}
            for future reference!
          </p>
        </div>
        <div className="home-img2">
          <img src={pic2} alt="Search" className="home-img2" />
        </div>
      </div>
      <div className="home-section3">
        <h2 className="home-heading3">What are you waiting for?</h2>
        <Link to="/SignUp">
          <button className="home-button">Sign Up</button>
        </Link>
        <p className="home-description3">
          or{" "}
          <Link to="/schools" className="home-link3">
            start exploring
          </Link>{" "}
          without an account.
        </p>
      </div>
    </section>
  );
}

export default Home;
