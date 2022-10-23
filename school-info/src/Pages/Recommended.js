import React from "react";
import { useContext } from "react";
import UpvoteContext from "../Contexts/UpvoteContext";
import SchoolsList from "../Components/SchoolsList";
import "../PagesCSS/Recommended.css";
import { Link } from "react-router-dom";

function Recommended() {
    const upvoteCtx = useContext(UpvoteContext);
    // gives us the current context

    let content;

    content = (
        <div>
            <SchoolsList schools={upvoteCtx.upvotes} />
        </div>
    );

    return (
        <section>
            <div className="rec-header">
                <h1 className="rec-title">Schools Recommended</h1>
            </div>
            {content}
        </section>
    );
}

export default Recommended;
