import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Comment from "./Comment"
import { useGetCommentList, useAddComment, useUpdateComment } from './CommentController';
import "../../PagesCSS/Forum/Comment.css"

function CommentUI(props) {

    // ADDITIONAL: Option to hide or show comments
    // ADDITIONAL: Option to show full comment if the comment is too long

    const { postId } = useParams();
    const commentList = useGetCommentList(postId)
    const [activeComment, setActiveComment] = useState(null);

    const rootComments = commentList.filter((doc) =>
        doc.values.parentId === null
    )

    const getReplies = (commentId) => {
        return commentList.filter((doc) =>
            doc.values.parentId === commentId)
            .sort((a, b) =>
                a.values.createdAt - b.values.createdAt)
    }

    return (
        <>
            <h3 className='comments-title'>Comments</h3>
            <div className='comments'>
                <div className='comments-container'>

                    {rootComments.map((comments) => {
                        return <Comment
                            key={comments.id}
                            comment={comments}
                            replies={getReplies(comments.id)}
                            getReplies={getReplies}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                            updateComment={useUpdateComment}
                            addComment={useAddComment}
                            userList={props.userList}
                        />
                    })}
                </div>
            </div>
        </>
    );
}

export default CommentUI