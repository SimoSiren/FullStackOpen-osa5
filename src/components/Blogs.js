import React from 'react'

const Blogs = ({ blog, user }) => {
    return (
        <div>
            <h4>Title: {blog.title} Author: {blog.author}</h4>
            <p>Url: {blog.url} Likes: {blog.likes}</p>
            <p>Added by: {user.name}</p>
        </div >
    )
}

export default Blogs