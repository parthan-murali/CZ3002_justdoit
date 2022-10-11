import React from 'react'
import { useParams } from 'react-router-dom'
import "../../PagesCSS/Forum/Post.css";
import CommentUI from "./CommentUI"
import Time from "../../Components/DatePosted"
import { useGetPost } from "./PostController"
import avatar from "../../PagesCSS/Dashboard/avatar.png";
import CommentText from "./AddComment"
import { useAddComment } from './CommentController';
import { Backdrop, CircularProgress } from '@mui/material';
import { useGetUsers } from '../../Firebase';

// ADDITIONAL: Paragraphing (tweak firestore)

function PostUI() {

  const { postId } = useParams();
  const post = useGetPost(postId)
  const userList = useGetUsers();

  const userExist = (uid) => {
    if (userList.some((person) => person.uid === uid)) {
      return userList.filter((person) => person.uid === uid);
    }
    else
      return false
  }

  return (
    <div>{!userList ? (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>) : (
      <div className='post-page'>
        {post.map((details) => {
          return (
            <div key={details.id}>
              <div className='post-container' >
                <div className='post-header'>
                  <img className="post-user-img"
                    src={userExist(details.author.uid) && details.author.photoURL ? details.author.photoURL : avatar}
                    alt="avatar" />
                  <h3 className="post-user" >
                    {userExist(details.author.uid) ?
                      userExist(details.author.uid)[0].name : "Deleted User"}
                  </h3>
                  <Time content={details} />
                </div>

                <div className="post-section">
                  {details.values.imageURL &&
                    <a
                      href={details.values.imageURL}
                      target="_blank"
                      rel="noreferrer noopener">
                      <img className="post-img"
                        src={details.values.imageURL}
                        alt="" />
                    </a>}

                  <h1 className="post-title" >{details.values.title}</h1>
                  <p className="post-query" >{details.values.query}</p>
                </div>
                <CommentText
                  submitLabel='Comment'
                  handleSubmit={useAddComment}
                  postId={postId} />
              </div>
            </div>
          )
        })}
        <div>

          <CommentUI userList={userList} />
        </div>
      </div>
    )}</div>
  );
}

export default PostUI