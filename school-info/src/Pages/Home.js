import React from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/Home/Home.css";
import pic1 from "../PagesCSS/Home/choose.png";
import pic2 from "../PagesCSS/Home/search.png";

function Home() {
    return (
        <div className="container-fluid text-center">
            <div className="row home-section1 justify-content-center p-3 pb-0 p-lg-0">
                <h1 className="home-heading1">
                    Tough time finding the right schools?
                </h1>
                <p className="home-description1 m-3">
                    With SchoolCompare, you can find the perfect school for you
                    or your child in the nick of time.
                </p>
                <img src={pic1} alt="Choose" className="home-img1 mt-3" />
            </div>
            <div className="row home-section2 p-4 p-lg-5 align-items-center">
                <div className="col-md-6 text-end p-4 p-lg-5">
                    <h2 className="home-heading2 ps-lg-3">
                        All the information you need in just a few clicks.
                    </h2>
                    <p className="home-description2 my-3 my-lg-5 ps-lg-3">
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
                <div className="col-md-4 m-lg-5">
                    <img src={pic2} alt="Search" className="home-img2" />
                </div>
            </div>
            <div className="row home-section3 p-5 justify-content-center">
                <h2 className="home-heading3 mt-5 p-2">
                    What are you waiting for?
                </h2>
                <Link to="/SignUp">
                    <button className="home-button m-3">Sign Up</button>
                </Link>
                <p className="home-description3 mb-5 pb-3">
                    or{" "}
                    <Link to="/schools" className="home-link3">
                        start exploring
                    </Link>{" "}
                    without an account.
                </p>
            </div>
        </div>
    );
}

export default Home;
