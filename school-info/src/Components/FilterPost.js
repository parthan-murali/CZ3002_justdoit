import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "../ComponentsCSS/FilterPost.css"

function FilterPost(props) {
    const [open, setOpen] = useState(false);
    return (

        <div className="btn-dropdown-container">
            <div
                className="btn-dropdown-selection"
                onClick={() => {
                    setOpen(!open)
                }}
            >
                <p className="btn-dropdown-chosen">{props.chosen}</p>
                <FontAwesomeIcon className="fa-chevron-downs" icon={faChevronDown} />
            </div>
            {open && (
                <div className="btn-dropdown-content">
                    <li className="btn-dropdown-item" >
                        <p className="btn-dropdown-item"
                            onClick={() => {
                                props.setChosen("Latest")
                                setOpen(!open)
                            }}>
                            Latest
                        </p>
                    </li>
                    <li className="btn-dropdown-item">
                        <p className="btn-dropdown-item"
                            onClick={() => {
                                props.setChosen("Oldest")
                                setOpen(!open)
                            }}>
                            Oldest
                        </p>
                    </li>
                    <li className="btn-dropdown-item">
                        <p className="btn-dropdown-item"
                            onClick={() => {
                                props.setChosen("Activity")
                                setOpen(!open)
                            }}>
                            Activity
                        </p>
                    </li >
                </div >
            )
            }
        </div >
    );
}

export default FilterPost;
