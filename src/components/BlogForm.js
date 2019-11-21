import React from 'react'

// Used for adding new blogs, state is in the app.js

const BlogForm = ({ addBlog, newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl, newLikes,
    setNewLikes }) => {
    return (
        <form onSubmit={addBlog}>
            <div>
                title: <input type="text" value={newTitle} name="Title"
                    onChange={({ target }) => setNewTitle(target.value)} />
            </div>
            <div>
                author: <input type="text" value={newAuthor} name="Author"
                    onChange={({ target }) => setNewAuthor(target.value)} />
            </div>
            <div>
                url: <input type="link" value={newUrl} name="URL"
                    onChange={({ target }) => setNewUrl(target.value)} />
            </div>
            <div>
                likes: <input type="text" value={newLikes} name="Likes"
                    onChange={({ target }) => setNewLikes(target.value)} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default BlogForm