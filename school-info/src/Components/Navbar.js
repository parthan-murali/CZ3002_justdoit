import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../ComponentsCSS/Navbar.css";
import avatar from "../PagesCSS/Dashboard/avatar.png";

import { NavLink } from "react-router-dom";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useState, useContext } from "react";
import FavouritesContext from "../Contexts/FavouritesContext";
import { useAuth, logout } from "../Firebase";
import CompareContext from "../Contexts/CompareContext";

// Change the inline-style on selecting the respective tabs
let activeStyle = {
    color: "#80De80",
    transition: "all 0.2s linear",
};

function Navbar() {
    const [expandNavBar, setExpandNavBar] = useState(false);
    const favouritesCtx = useContext(FavouritesContext);
    const compareCtx = useContext(CompareContext);

    const user = useAuth();

    return (
        <nav className="navbar-main">
            <ul className="navbar-ul">
                <div className="fa-book-icon">
                    <FontAwesomeIcon
                        className="fa-book-icon"
                        icon={faBookOpen}
                    />
                    SchoolInfo
                </div>
                <div className="navbar-headers">
                    {/* To Home page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Home
                        </NavLink>
                    </li>

                    {/* To Schools page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/schools"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Schools
                        </NavLink>
                    </li>

                    {/* To Favourites page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/favourites"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Favourites
                            <span className="navbar-badge">
                                {favouritesCtx.totalFavourites}
                            </span>
                        </NavLink>
                    </li>

                    {/* To Compare Page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/compare"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Compare
                            <span className="navbar-badge">
                                {compareCtx.totalSchools}
                            </span>
                        </NavLink>
                    </li>

                    {/* To Forum page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/forum"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Forum
                        </NavLink>
                    </li>

                    {/* To Feedback page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/feedback"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Feedback
                        </NavLink>
                    </li>
                </div>

                <div className="navbar-headers">
                    {/* To Dashboard page */}
                    <li className="navbar-list">
                        <NavLink
                            className="navbar-items"
                            to="/dashboard"
                            style={({ isActive }) =>
                                isActive ? activeStyle : undefined
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    {!user && (
                        <>
                            {/* To Login page */}
                            <li className="navbar-list">
                                <NavLink
                                    className="navbar-items"
                                    to="/login"
                                    style={({ isActive }) =>
                                        isActive ? activeStyle : undefined
                                    }
                                >
                                    Log In
                                </NavLink>
                            </li>

                            <li className="navbar-list">
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    className="navbar-avatar"
                                />
                            </li>
                        </>
                    )}

                    {user && (
                        <>
                            {/* To Logout */}
                            <li className="navbar-list">
                                <NavLink
                                    className="navbar-items"
                                    to="/"
                                    style={({ isActive }) =>
                                        isActive ? activeStyle : undefined
                                    }
                                    onClick={logout}
                                >
                                    Log Out
                                </NavLink>
                            </li>

                            <li className="navbar-list">
                                <img
                                    src={user.photoURL ? user.photoURL : avatar}
                                    alt="avatar"
                                    className="navbar-avatar"
                                />
                            </li>
                        </>
                    )}
                </div>

                <div
                    className="hamburger-menu"
                    onClick={() => {
                        setExpandNavBar((currentValue) => !currentValue);
                    }}
                >
                    {expandNavBar ? (
                        <>
                            <FontAwesomeIcon
                                className="fa-cross-icon"
                                icon={faXmark}
                                color="#fff"
                            />
                            <nav className="navbar-mobile">
                                <ul className="navbar-ul-mobile">
                                    {/* To Home page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            Home
                                        </NavLink>
                                    </li>

                                    {/* To Schools page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/schools"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            Schools
                                        </NavLink>
                                    </li>

                                    {/* To Favourites page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/favourites"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            <span className="navbar-badge">
                                                {favouritesCtx.totalFavourites}
                                            </span>
                                            Favourites
                                        </NavLink>
                                    </li>

                                    {/* To Forum page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/forum"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            Forum
                                        </NavLink>
                                    </li>

                                    {/* To Feedback page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/feedback"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            Feedback
                                        </NavLink>
                                    </li>

                                    {/* To Compare Page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/compare"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            <span className="navbar-badge">
                                                {compareCtx.totalSchools}
                                            </span>
                                            Compare
                                        </NavLink>
                                    </li>

                                    {/* To Dashboard page */}
                                    <li className="navbar-list-mobile">
                                        <NavLink
                                            className="navbar-items-mobile"
                                            to="/dashboard"
                                            style={({ isActive }) =>
                                                isActive
                                                    ? activeStyle
                                                    : undefined
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    {!user && (
                                        <>
                                            {/* To Login page */}
                                            <li className="navbar-list-mobile">
                                                <NavLink
                                                    className="navbar-items-mobile"
                                                    to="/login"
                                                    style={({ isActive }) =>
                                                        isActive
                                                            ? activeStyle
                                                            : undefined
                                                    }
                                                >
                                                    Log In
                                                </NavLink>
                                            </li>
                                            <li className="navbar-list-mobile">
                                                <img
                                                    src={avatar}
                                                    alt="avatar"
                                                    className="navbar-avatar-mobile"
                                                />
                                            </li>
                                        </>
                                    )}

                                    {user && (
                                        <>
                                            {/* To Logout */}
                                            <li className="navbar-list-mobile">
                                                <NavLink
                                                    className="navbar-items-mobile"
                                                    to="/"
                                                    style={({ isActive }) =>
                                                        isActive
                                                            ? activeStyle
                                                            : undefined
                                                    }
                                                    onClick={logout}
                                                >
                                                    Log Out
                                                </NavLink>
                                            </li>
                                            <li className="navbar-list-mobile">
                                                <img
                                                    src={
                                                        user.photoURL
                                                            ? user.photoURL
                                                            : avatar
                                                    }
                                                    alt="avatar"
                                                    className="navbar-avatar-mobile"
                                                />
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </nav>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faBars} color="#fff" />
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;
