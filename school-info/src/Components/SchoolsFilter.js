import axios from "axios";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

function SchoolsFilter(props) {
    const schools = props.data;

    const inLevel = (schName) => {
        let nameList = schools.map((school) => {
            return school.school_name.toUpperCase();
        });

        return nameList.includes(schName);
    };

    const level = props.level;
    const districts = getDistricts(schools);
    const [ccaGrps, setCCAGrps] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [electives, setElectives] = useState(null);

    async function fetchData() {
        let ccaGrpsSet = new Set();
        let subjectsSet = new Set();
        let electivesSet = new Set();
        let item1, item2, item3;

        // CCAs for the chosen level
        const q1 = query(
            collection(db, "ccas"),
            where("school_section", "==", level)
        );

        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach((doc) => {
            item1 = doc.data().cca_grouping_desc;
            ccaGrpsSet.add(item1);
            console.log(doc.id, " => ", doc.data());
        });
        setCCAGrps([...ccaGrpsSet].sort());

        // subjects for the chosen level
        const querySnapshot2 = await getDocs(collection(db, "subjects"));
        querySnapshot2.forEach((doc) => {
            if (inLevel(doc.data().school_name)) {
                item2 = doc.data().subject_desc;
                subjectsSet.add(item2);
                console.log(doc.id, " => ", doc.data());
            }
        });
        setSubjects([...subjectsSet].sort());

        // electives for the chosen level
        const querySnapshot3 = await getDocs(collection(db, "electives"));
        querySnapshot3.forEach((doc) => {
            if (inLevel(doc.data().school_name)) {
                item3 = doc.data().moe_programme_desc;
                electivesSet.add(item3);
                console.log(doc.id, " => ", doc.data());
            }
        });
        setElectives([...electivesSet].sort());
    }

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchData();
        }
        return () => {
            isMounted = false;
        };
    }, []);

    function titleCase(str) {
        console.log("str =", str);
        return str
            .toLowerCase()
            .split(" ")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

    function getDistricts(schools) {
        let uniqueDistricts = [
            ...new Set(
                schools.map(function (school) {
                    return school.dgp_code;
                })
            ),
        ];
        let sortedDistricts = uniqueDistricts.sort();

        return sortedDistricts;
    }

    return (
        // TODO: Hidden dropdowns for each subgroup
        <form action="" id="school-filters">
            <div className="group">
                <label htmlFor="location">Location</label>
                <select name="location" id="location">
                    <option value="">Select an area</option>
                    {districts.map(function (district) {
                        return (
                            <option value={district} key={district}>
                                {titleCase(district)}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="group">
                <label htmlFor="cca">CCAs</label>
                <select name="cca" id="cca">
                    <option value="">All categories</option>
                    {ccaGrps?.forEach(function (ccaGrp) {
                        console.log("ccaGrps =", ccaGrps);
                        return (
                            <option value={ccaGrp} key={ccaGrp}>
                                {console.log("Loading CCAs")}
                                {titleCase(ccaGrp)}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="group">
                <label htmlFor="subject">Subjects</label>
                <select name="subject" id="subject">
                    <option value="">Search for subjects</option>
                    {subjects?.forEach(function (subj) {
                        return (
                            <option value={subj} key={subj}>
                                {console.log("Loading Subjects")}
                                {titleCase(subj)}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="group">
                <label htmlFor="elective">Electives & Programmes</label>
                <select name="elective" id="elective">
                    <option value="">Search for electives or programmes</option>
                    {electives?.forEach(function (elective) {
                        return (
                            <option value={elective} key={elective}>
                                {console.log("Loading Electives")}
                                {titleCase(elective)}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="group">
                <label>
                    <input type="checkbox" value="1" name="person_intern" />{" "}
                    Intern
                </label>
            </div>
        </form>
    );
}

export default SchoolsFilter;
