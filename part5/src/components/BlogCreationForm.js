import { useRef } from 'react'

const BlogCreationForm = ({ handleBlogCreate }) => {
  const titleRef = useRef()
  const authorRef = useRef()
  const urlRef = useRef()

  const getFields = () => (
    {
      title: titleRef.current.value,
      author: authorRef.current.value,
      url: urlRef.current.value
    }
  )

  const handleCreate = async (event) => {
    event.preventDefault()
    const { title, author, url } = getFields()
    const newBlogObj = {
      title,
      author,
      url,
    }

    handleBlogCreate(newBlogObj)
    event.target.reset()
  }

  return (
    <div>
      <h1>Create new</h1>
      <form onSubmit={handleCreate} role='form'>
        <div>
            title:
          <input id='titleInputField' ref={titleRef}/>
        </div>
        <div>
            author:
          <input id='authorInputField' ref={authorRef}/>
        </div>
        <div>
            url:
          <input id='urlInputField' ref={urlRef}/>
        </div>
        <button id='create-btn' type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogCreationForm