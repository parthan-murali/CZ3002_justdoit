import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, getUpvotes, updateUpvotes } from "../Firebase";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
} from "firebase/firestore";

const UpvoteContext = createContext({
    upvotes: [],
    totalUpvotes: {},
    addUpvote: (upvoteSchool) => {},
    removeUpvote: (schoolId) => {},
    itemIsUpvoted: (schoolId) => {},
});

export function UpvoteContextProvider(props) {
    const [currentUser, isLoading /* , err*/] = useAuthState(auth);
    const [userUpvotes, setuserUpvotes] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState("");
    const [uid, setUid] = useState(null);

    const fetchUser = async () => {
        if (currentUser) {
            setUid(currentUser.uid);
        } else {
            setuserUpvotes([]);
        }
    };
    const fetchCounts = async () => {
        let obj = {};
        const querySnapshot = await getDocs(collection(db, "upvotes"));
        querySnapshot.forEach((doc) => {
            obj[doc.data()._id] = doc.data().count;
        });
        setCounts(obj);
    };

    useEffect(() => {
        fetchUser().then(() => {
            fetchCounts().then(() => {
                getUpvotes().then((data) => {
                    if (data) {
                        setuserUpvotes(data);
                    }
                });
            });
            // .then(() => {
            //     setLoading(false);
            // });
        });

        console.log("Fetch Upvotes COMPLETE:", counts);
    }, [isLoading, currentUser]);

    console.log("initial user upvotes =", userUpvotes);

    useEffect(() => {
        if (uid) {
            updateUpvotes(userUpvotes)
                .then(() => {
                    console.log(
                        update,
                        "userUpvotes =",
                        userUpvotes,
                        "counts =",
                        counts
                    );
                })
                .catch((err) => console.error(err));
        }
    }, [update]);

    useEffect(() => {}, [counts]);

    async function updateCountHandler(id) {
        // Updates total count for each school
        const count = counts[id];
        console.log("updateCountHandler > count =", count);

        const q = query(collection(db, "upvotes"), where("_id", "==", id));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.docs[0]) {
            await addDoc(collection(db, "upvotes"), {
                _id: id,
                count: count,
            });
        } else {
            const userRef = querySnapshot.docs[0].ref;

            await updateDoc(userRef, {
                count: count,
            }).catch((err) => {
                console.error("updateCountHandler error: ", err);
            });
        }
    }

    function addUpvoteHandler(upvoteSchool) {
        const id = upvoteSchool._id;
        let prev = counts;
        if (prev[id]) {
            prev[id] += 1;
        } else {
            prev[id] = 1;
        }
        setCounts(prev);
        console.log("addUpvoteHandler > count =", counts[id]);
        updateCountHandler(id);
        const newUserUpvotes = userUpvotes.concat(upvoteSchool);
        setuserUpvotes(newUserUpvotes);
        setUpdate("add " + id);
    }

    function removeUpvoteHandler(schoolId) {
        let prev = counts;
        prev[schoolId] -= 1;
        setCounts(prev);
        console.log("removeUpvoteHandler > count =", counts[schoolId]);
        updateCountHandler(schoolId);
        const newUserUpvotes = userUpvotes.filter(
            (school) => school._id !== schoolId
        );
        setuserUpvotes(newUserUpvotes);
        setUpdate("remove " + schoolId);
    }

    function itemIsUpvotedHandler(schoolId) {
        return userUpvotes.some((school) => school._id === schoolId);
    }

    const context = {
        upvotes: userUpvotes,
        totalUpvotes: counts,
        addUpvote: addUpvoteHandler,
        removeUpvote: removeUpvoteHandler,
        itemIsUpvoted: itemIsUpvotedHandler,
        // exposes these functions to all wrapped components
    };

    useEffect(() => {
        localStorage.setItem("upvotes", JSON.stringify(context.upvotes));
    }, [context.upvotes]);

    return (
        <UpvoteContext.Provider value={context}>
            {/* value={context} is for updating the context so that other components wrapped by this provider will be informed
         Wraps around all components that are interested in interacting with the context */}
            {props.children}
        </UpvoteContext.Provider>
    );
}

export default UpvoteContext;
