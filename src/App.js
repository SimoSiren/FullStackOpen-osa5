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
  const [loginVisible, setLoginVisible] = useState(false)

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

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleSubmit}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  const handleLogOut = () => {
    localStorage.clear()

    setIsPositive(true)
    setErrorMessage('Logout was succesfull!')

    setTimeout(() => {
      setErrorMessage(null)
      window.location.reload()
    }, 2500)
  }


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

  //------BLOG FORM SUBMIT HANDLER---------------------
  const addBlog = async (event) => {
    event.preventDefault()
    let newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes,
      user: user.name
    }
    try {
      const created = await blogsService.create(newBlog)
      const refreshed = await setBlogs(blogs.concat(created))
      setIsPositive(true)
      setErrorMessage('Uusi blogi tallennettu')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)

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
        <loginForm />
      </div>
    )
  }
  //---------------RENDER-WHEN-USER-IS-LOGGED-IN----------------
  else {
    return (
      <div>
        <Notification isPositive={isPositive} message={errorMessage} />
        <button style={{ width: "100px", height: "25px", marginLeft: "300px" }}
          onClick={handleLogOut} >
          LOGOUT
        </button>
        <h1>Bloglist</h1>


        <h3>Add blog</h3>
        <BlogForm addBlog={addBlog} newTitle={newTitle} setNewTitle={setNewTitle} newAuthor={newAuthor} setNewAuthor={setNewAuthor} newUrl={newUrl} setNewUrl={setNewUrl} newLikes={newLikes}
          setNewLikes={setNewLikes}
        />

        <h2>Blog listing</h2>

        {
          blogs.map(blog =>
            <Blogs key={blog.title} blog={blog} user={user} />
          )
        }

      </div >
    )
  }
}

export default App