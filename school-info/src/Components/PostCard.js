import React from 'react'
import { Link } from "react-router-dom";
import "../ComponentsCSS/PostCard.css"

function PostCard(props) {
    return (
        <Link to={`./post/${props.content.values.title.trim().replace(/\s+/g, '-')}/${props.content.id}`}>
            <div className="card-container">
                <div className='card-content'>
                    <h2 className="card-title">{props.content.values.title}</h2>
                    <p className="card-body">
                        {props.content.values.query.substring(0, 150)}
                        {props.content.values.query.length > 150 && "..."}
                    </p>
                </div>

            </div>
        </Link>
    )
}

export default PostCard
