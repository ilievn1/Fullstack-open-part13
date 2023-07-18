const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogsInDB = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 }).populate('comments', { content: 1 })

  return response.json(blogsInDB)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const blogCreator = await User.findById(blog.user)
  blog.user = blogCreator
  return response.json(blog)

})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user

  const newBlog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id.toString() 
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  const userid = request.user._id
  const blog = await Blog.findById(request.params.id)

  if (blog && blog.user.toString() === userid.toString() ){
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }

  return response.status(401).end()

})

blogsRouter.put('/:id', async (request, response) => {
  const blogNewLikes = request.body
  const updatedLikesBlog = await Blog
    .findByIdAndUpdate(request.params.id, blogNewLikes,
      { new: true,
        runValidators: true,
        context: 'query'
      })
  return response.json(updatedLikesBlog)

})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body

  const blog = await Blog.findById(request.params.id)

  const newComment = new Comment({
    content,
    blog: blog._id 
  })

  const savedComment = await newComment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  return response.status(201).json(savedComment)

})



module.exports = blogsRouter