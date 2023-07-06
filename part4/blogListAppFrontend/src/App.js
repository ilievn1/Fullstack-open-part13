import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import Notification from './components/Notification.js'
import LoginForm from './components/LoginForm.js'
import BlogCreationForm from './components/BlogCreationForm.js'
import Togglable from './components/Togglable.js'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const togglableFormRef = useRef()

  useEffect(() => {
    const fetchBlogsHook = async () => {
      const blogsArray = await blogService.getAll()
      setBlogs(blogsArray.sort((a, b) => b.likes - a.likes))
    }
    if (user) {
      fetchBlogsHook().catch(console.error)
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('Wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogUser')
    setBlogs([])
    setUser(null)
    blogService.clearToken()
  }
  const handleBlogCreate = async (newBlogObj) => {
    const retBlogObj = await blogService.create(newBlogObj)

    togglableFormRef.current.toggleVisibility()

    const sortedBlogs = blogs
      .concat({ ...retBlogObj,
        user: {
          username:user.username,
          name: user.name,
          id: retBlogObj.user
        } }) // solution to missing usr, when adding new blog
      .sort((a, b) => b.likes - a.likes)

    setBlogs(sortedBlogs)

    setNotification(`a new blog ${retBlogObj.title} by ${retBlogObj.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }
  const handleBlogLike = async (blog) => {

    const likedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    const retBlogObj = await blogService.updateLikes(blog.id, likedBlog)
    const sortedBlogs = blogs
      .map(blog =>
        blog.id === retBlogObj.id
          ? { ...blog, likes: likedBlog.likes }
          : blog
      )
      .sort((a,b) => b.likes - a.likes)

    setBlogs(sortedBlogs)
  }
  const handleBlogDelete = async (blog) => {
    const toBeDeleted = blog
    if (window.confirm(`Remove ${toBeDeleted.title} by ${toBeDeleted.author}?`)) {
      await blogService.deleteBlog(blog.id)
      const sortedBlogs = blogs
        .filter(b => toBeDeleted.id !== b.id)
        .sort((a,b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }
  }


  if (!user) {
    return (
      <>
        <Notification message={notification}/>
        <LoginForm handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password} />
      </>
    )
  }

  return (
    <>
      <div>
        <p>{user.name} logged in</p>

        <form onSubmit={handleLogout}>
          <button type='submit'>Log out</button>
        </form>

      </div>

      <Notification message={notification}/>
      <Togglable buttonLabel={'new blog'} ref={togglableFormRef}>
        <BlogCreationForm handleBlogCreate={handleBlogCreate}/>
      </Togglable>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          currUsr={user}
          handleLike={() => handleBlogLike(blog)}
          handleDelete={() => handleBlogDelete(blog)}/>
      )}
    </>
  )
}

export default App