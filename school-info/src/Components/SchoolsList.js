import SchoolsCard from "./SchoolsCard";
import "../ComponentsCSS/SchoolsList.css";
import React from "react";

function SchoolsList(props) {
    console.log("SchoolsList > props.schools =", props.schools);
    return (
        <ul className="list">
            {props.schools.map((school) => (
                <div key={school._id}>
                    <SchoolsCard data={school} />
                </div>
            ))}
        </ul>
    );
}

export default SchoolsList;
