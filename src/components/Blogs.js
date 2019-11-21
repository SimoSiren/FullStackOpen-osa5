import React from 'react'

const Blogs = ({ blog, user }) => {
    return (
        <div>
            <p>____________________________________________________________</p>
            <h3>Title: {blog.title} </h3>
            <h4>Author: {blog.author}</h4>
            <h4>Url: {blog.url} </h4>
            <p>Added by: {user.name}</p>
            <h4>Likes: {blog.likes} <button>Like!</button></h4>

        </div >
    )
}

export default Blogs