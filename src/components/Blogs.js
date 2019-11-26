import React, { useState } from 'react'

const Blogs = ({ blog, user, handleDeleteClick, like }) => {

    const [showBlog, setShowBlog] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    if (showBlog === false) {
        return (
            <div key={blog.id} style={blogStyle}>
                <h3 onClick={() => setShowBlog(true)}> {blog.title}</h3>
            </div>
        )
    }
    else {
        return (
            <div key={blog.id} style={blogStyle}>

                <h3 onClick={() => setShowBlog(false)}> {blog.title} </h3>
                <h4>Author: {blog.author}</h4>
                <h4>Url: {blog.url} </h4>
                <p>Added by: {user.name}</p>
                <h4>Likes: {blog.likes} <button onClick={() => like(blog.id)}>Like!</button></h4>
                <button style={{ height: '30px', width: '70px' }}
                    onClick={() => handleDeleteClick(blog.id)}>Delete</button>

            </div >

        )
    }
}

export default Blogs
