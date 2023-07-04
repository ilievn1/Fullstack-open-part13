import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import Notification from './components/Notification.js'
import LoginForm from './components/LoginForm.js'
import BlogCreationForm from './components/BlogCreationForm.js'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)



  useEffect(() => {
    const fetchBlogsHook = async () => {
      const blogsArray = await blogService.getAll()
      setBlogs(blogsArray)
    }
    fetchBlogsHook().catch(console.error)
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
  const handleBlogCreate = async (event) => {
    event.preventDefault()
    const newBlogTitle = event.target.elements[0].value
    const newBlogAuthor = event.target.elements[1].value
    const newBlogUrl = event.target.elements[2].value
    
    const newBlogObj = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }
    const retBlogObj = await blogService.create(newBlogObj)
    event.target.reset()
    setBlogs(blogs.concat(retBlogObj))
    setNotification(`a new blog ${newBlogTitle} by ${newBlogAuthor} added`)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
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
      <BlogCreationForm handleBlogCreate={handleBlogCreate} />

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )
}

export default App