import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, orderBy, addDoc, Timestamp, updateDoc, doc, where, getDocs } from "firebase/firestore"
import { db, auth } from "../../Firebase"
import { toast } from 'react-toastify';

function useGetCommentList(postId) {

    const [commentList, setCommentList] = useState([]);
    useEffect(() => {
        let isMounted = true;
        const q = query(collection(db, "comments"),
            orderBy("values.createdAt", "desc"));

        const getCommentList = onSnapshot(q, (snapshot) => {
            if (isMounted) {
                setCommentList(
                    snapshot.docs.filter((doc) => (
                        doc.data().values.postId === postId))
                        .map((doc) => ({
                            ...doc.data(),
                            id: doc.id,
                        })))
            }
        });
        return () => {
            getCommentList();
            isMounted = false;
        }
    }, [postId]);
    return commentList;
}

async function useAddComment(body, postId, parentId = null) {

    const q = query(collection(db, "users"), where("uid", "==", `${auth.currentUser.uid}`));
    const doc = await getDocs(q);
    await addDoc(collection(db, "comments"), {
        author: {
            name: doc.docs[0].data().name,
            uid: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL ? auth.currentUser.photoURL : null
        },
        values: {
            body,
            createdAt: Timestamp.now().toDate(),
            parentId,
            postId
        }
    }).then(() => {
        toast("Succesfully updated!", { type: "success" });
    }).catch(error => {
        toast("Comment update failed!", { type: "error" })
        console.log(error)
    })
}

const useUpdateComment = async (text, commentId) => {

    await updateDoc(doc(db, "comments", commentId), {
        "values.body": text
    }).then(() => {
        toast("Succesfully updated!", { type: "success" });
    }).catch(error => {
        toast("Comment update failed!", { type: "error" })
        console.log(error)
    })
}


export { useGetCommentList, useAddComment, useUpdateComment };