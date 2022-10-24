import { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../../Firebase"


function useGetPost(postId) {
    const [post, setPost] = useState([]);
    useEffect(() => {
        let isMounted = true;
        const getSpecificPost = onSnapshot(doc(db, "posts", postId), (doc) => {
            if (isMounted) {
                setPost([{
                    ...doc.data(),
                    id: doc.id
                }])
            }
        })

        return () => {
            getSpecificPost();
            isMounted = false;
        };

    }, [postId]);
    return post
}
function useGetPostsReplies() {
    const [postList, setPostList] = useState([]);
    const [replyList, setReplyList] = useState([]);
    useEffect(() => {
        let isMounted = true;
        const postsCollectionRef = query(collection(db, "posts"),
            orderBy("values.createdAt", "desc"));
        const getPosts = async () => {
            const col = await getDocs(postsCollectionRef);
            if (isMounted) {
                setPostList(col.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                })))
            }
            return getPosts;
        }
        const getReplies = async () => {
            const querySnapshot = await getDocs(collection(db, "comments"));
            if (isMounted) {
                setReplyList(querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                })))
            }
        }
        getPosts();
        getReplies();
        return () => {
            isMounted = false;
        };
    }, []);
    return [postList, replyList];
}


export { useGetPost, useGetPostsReplies }