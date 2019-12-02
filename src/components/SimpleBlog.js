import React from 'react'

const SimpleBlog = ({ blog, onClick }) => (

    <div>
        <div className="title">
            {blog.title}
        </div>
        <div className="author">
            {blog.author}
        </div>
        <div className="likes">
            blog has {blog.likes} likes
         <button className="likeButton" onClick={onClick}>like</button>
        </div>
    </div>
)

export default SimpleBlog