import { useState } from 'react'

const Blog = ({ blog, currUsr, handleLike, handleDelete }) => {
  const [blogFullVisible, setBlogFullVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showFullVisibility = { display: blogFullVisible ? '' : 'none' }
  const isUserCreator = blog.user.username === currUsr.username  ? true : false

  return (
    <div style={blogStyle} className='blogContents'>
      {blog.title} {blog.author}

      <button onClick={() => setBlogFullVisible(!blogFullVisible)}>
        {blogFullVisible ? 'hide' : 'view'}
      </button>

      <div data-testid={'extendedView'} style={showFullVisibility}>
        <a>url:{blog.url}</a>
        <p>likes: {blog.likes}</p>
        <button onClick={handleLike}>like</button>
        <p>{blog.user.name}</p>
        {isUserCreator ? <button onClick={handleDelete}>delete</button> : null}
      </div>

    </div>
  )
}

export default Blog