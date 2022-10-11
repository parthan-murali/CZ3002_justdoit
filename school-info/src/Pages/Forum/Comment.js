import React from 'react'
import Time from "../../Components/DatePosted"
import { useAuth } from "../../Firebase"
import AddComment from "./AddComment"
import { useNavigate } from 'react-router-dom';
import avatar from "../../PagesCSS/Dashboard/avatar.png";
import { toast } from 'react-toastify';

function Comment(props) {

    const user = useAuth()

    const editTime = 300000;
    const timePassed = (new Date() - props.comment.values.createdAt.toDate()) > editTime
    const canEdit = user && props.comment.author.uid === user.uid && !timePassed
    const isEditing =
        props.activeComment &&
        props.activeComment.id === props.comment.id &&
        props.activeComment.type === "editing";
    const isReplying =
        props.activeComment &&
        props.activeComment.id === props.comment.id &&
        props.activeComment.type === "replying";
    const parentId = props.comment.id
    const postId = props.comment.values.postId
    const navigate = useNavigate();

    const userExist = (uid) => {
        if (props.userList.some((person) => person.uid === uid)) {
            return props.userList.filter((person) => person.uid === uid);
        }
        else
            return false
    }
    return (
        // <div>{!userList ? (
        //     <Backdrop
        //         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        //         open
        //     >
        //         <CircularProgress color="inherit" />
        //     </Backdrop>) : (
        <div className='comment'>
            <div className='comment-image-container'>
                {/* <img /> */}
                <img className="post-user-img"
                    src={userExist(props.comment.author.uid) && props.comment.author.photoURL ? props.comment.author.photoURL : avatar}
                    alt="avatar" />
            </div>
            <div className='comment-right-part'>

                <div className='comment-content'>
                    {/*Author*/}
                    <div className='comment-author'>
                        {userExist(props.comment.author.uid) ?
                            userExist(props.comment.author.uid)[0].name : "Deleted User"}
                    </div>
                    <Time content={props.comment} />
                </div>

                {/* Edit Comment or comment body */}
                {!isEditing ?
                    <div className='comment-text'>
                        {props.comment.values.body}
                    </div> :
                    <AddComment
                        submitLabel='Update'
                        hasCancelButton
                        initialText={props.comment.values.body}
                        handleSubmit={(text) => {
                            props.updateComment(text, props.comment.id)
                            props.setActiveComment(null)
                        }}
                        handleCancel={() => props.setActiveComment(null)}
                    />
                }

                {/* Comment Actions*/}
                <div className='comment-actions'>
                    <div
                        className='comment-action'
                        onClick={() => user ? (user.emailVerified ? props.setActiveComment({ id: props.comment.id, type: 'replying' }) :
                            toast("Please verify your email.", { type: "error" })) :
                            navigate("/login")}>
                        Reply
                    </div>
                    {canEdit && (
                        <div
                            className='comment-action'
                            onClick={() => props.setActiveComment({ id: props.comment.id, type: 'editing' })}>
                            Edit
                        </div>
                    )}
                </div>


                {/* To Reply*/}
                {isReplying && (
                    <AddComment
                        submitLabel="Reply"
                        handleSubmit={(text) => {
                            props.addComment(text, postId, parentId)
                            props.setActiveComment(null)
                        }}
                    />
                )}

                {/* Nested Replies*/}
                {props.replies.length > 0 && (
                    <div className='replies'>
                        {props.replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                replies={props.getReplies(reply.id)}
                                getReplies={props.getReplies}
                                activeComment={props.activeComment}
                                setActiveComment={props.setActiveComment}
                                updateComment={props.updateComment}
                                addComment={props.addComment}
                                parentId={parentId}
                                userList={props.userList}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
        // </div>
    )
}

export default Comment