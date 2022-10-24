import { db } from "../Firebase.js";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

let CCAs;
let subjects;
let electives;

async function fetchData() {
    let controller = new AbortController();
    const ccasURL =
        "https://data.gov.sg/api/action/datastore_search?resource_id=dd7a056a-49fa-4854-bd9a-c4e1a88f1181&limit=5430";
    const subjectsURL =
        "https://data.gov.sg/api/action/datastore_search?resource_id=3bb9e6b0-6865-4a55-87ba-cc380bc4df39&limit=3390";
    const electivesURL =
        "https://data.gov.sg/api/action/datastore_search?resource_id=9a94c7ed-710b-4ba5-8e01-8588f129efcc&limit=80";

    try {
        const getCCAs = await axios.get(ccasURL);
        CCAs = getCCAs.data.result.records;

        const getSubjects = await axios.get(subjectsURL);
        subjects = getSubjects.data.result.records;

        const getElectives = await axios.get(electivesURL);
        electives = getElectives.data.result.records;

        console.log("Fetch COMPLETE");
    } catch (err) {
        console.error(err);
    }

    controller.abort();
}

async function storeCCA(rec) {
    try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "ccas"), {
            school_name: rec.school_name,
            school_section: rec.school_section,
            cca_grouping_desc: rec.cca_grouping_desc,
            cca_generic_name: rec.cca_generic_name,
            cca_customized_name: rec.cca_customized_name,
            id: rec._id,
        });
        // console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

async function storeSubject(rec) {
    try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "subjects"), {
            school_name: rec.school_name,
            subject_desc: rec.subject_desc,
            id: rec._id,
        });
        // console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

async function storeElectives(rec) {
    try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "electives"), {
            school_name: rec.school_name,
            moe_programme_desc: rec.moe_programme_desc,
            id: rec._id,
        });
        // console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

async function main() {
    console.log("Fetching data from data.gov.sg...");
    await fetchData();

    let i;
    let j;
    let k;

    // // store all CCA data
    // console.log("Storing of CCA data START");
    // for (i = 0; i < CCAs.length; i++) {
    //     await storeCCA(CCAs[i]);
    // }
    // console.log("Storing of CCA data COMPLETE. %d items in total.", i);

    // // store all Subject Offered data
    // console.log("Storing of Subjects Offered data START");
    // for (j = 0; j < subjects.length; j++) {
    //     await storeSubject(subjects[j]);
    // }
    // console.log(
    //     "Storing of Subjects Offered data COMPLETE. %d items in total.",
    //     j
    // );

    // store all MOE Programmes data
    console.log("Storing of MOE Programmes data START");
    for (k = 0; k < electives.length; k++) {
        await storeElectives(electives[k]);
    }
    console.log(
        "Storing of MOE Programmes data COMPLETE. %d items in total.",
        k
    );
}

main();
