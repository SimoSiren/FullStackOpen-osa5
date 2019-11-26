import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import loginService from './services/login'
import blogsService from './services/blogs'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/Loginform'
import Togglable from './components/Togglable'
import './index.css';


const App = () => {

  const [blogs, setBlogs] = useState([])
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isPositive, setIsPositive] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogsService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogsService.setToken(user.token)
    }
  }, [])

  //--- LOGOUT -------------------------------

  const handleLogOut = () => {
    localStorage.clear()

    setIsPositive(true)
    setErrorMessage('Logout was succesfull!')

    setTimeout(() => {
      setErrorMessage(null)
      window.location.reload()
    }, 2500)
  }

  //--------LOGIN-------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogsAppUser', JSON.stringify(user)
      )

      blogsService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setIsPositive(true)
      setErrorMessage('Login was succesfull!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)


    } catch (exception) {
      setIsPositive(false)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }
  //------------------DELETE---------------------------

  const handleDeleteClick = id => {
    const blogToRemove = blogs.find(blog => blog.id === id)
    console.log(blogToRemove.id, blogToRemove.title)
    if (window.confirm(`Removing ${blogToRemove.title}. Are you sure? `)) {
      blogsService
        .remove(id)
        .then(promise => {
          setBlogs(blogs.filter(filtered => filtered.id !== id))
          if (promise.status === 204) {
            setIsPositive(true)
            setErrorMessage(`${blogToRemove.title} was deleted from the database.`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          }
        })
        .catch(error => {
          setIsPositive(false)
          console.log('Palvelimen palauttama error: ', error.response.data)
          setErrorMessage(
            ` ${error.response.data} OR ${blogToRemove.title} may not have been deleted due unexpected error. Pls. check.`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
        })
    }
  }

  //------BLOG FORM SUBMIT HANDLER---------------------

  const addBlog = (event) => {
    event.preventDefault()
    let newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes,
      user: user.name
    }
    try {

      blogsService
        .create(newBlog)
        .then(data => {
          setBlogs(blogs.concat(data))
          setIsPositive(true)
          setErrorMessage('Uusi blogi tallennettu')
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        }
        )
    }
    catch {
      setIsPositive(false)
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
    finally {
      setNewAuthor('')
      setNewTitle('')
      setNewUrl('')
      setNewLikes('')
    }
  }

  //----------LIKE-UPDATE------------------------------------

  const like = id => {
    const blog = blogs.find(b => b.id === id)
    let newLikes = blog.likes + 1
    const likedBlog = {
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    blogsService
      .update(id, likedBlog)
      .then(data => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : data))
      })
      .catch(() => {
        setErrorMessage(
          `blog '${blog.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  //-----------APP.js returns to screen when not logged in------------

  if (user === null) {
    return (
      <div>
        <Notification isPositive={isPositive} message={errorMessage} />
        <h1>Bloglist</h1>
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleSubmit}
          />
        </Togglable>

      </div>
    )
  }
  //---------------RENDER-WHEN-USER-IS-LOGGED-IN----------------
  else {
    return (
      <div>
        <h1>Bloglist</h1>

        <Notification isPositive={isPositive} message={errorMessage} />
        <p>Logged in as {user.username}
          <button style={{ width: "100px", height: "25px", marginLeft: "300px" }}
            onClick={handleLogOut} >
            LOGOUT
          </button></p>

        <Togglable buttonLabel='Add new blog'>
          <BlogForm addBlog={addBlog} newTitle={newTitle} setNewTitle={setNewTitle} newAuthor={newAuthor} setNewAuthor={setNewAuthor} newUrl={newUrl} setNewUrl={setNewUrl} newLikes={newLikes}
            setNewLikes={setNewLikes}
          />
        </Togglable>

        <h2 style={{ color: 'blue' }}>Blog listing</h2>

        {blogs.map(blog =>
          <Blogs key={blog.id} blog={blog} user={user}
            handleDeleteClick={handleDeleteClick} like={like} />
        )}
      </div>
    )
  }
}

export default App