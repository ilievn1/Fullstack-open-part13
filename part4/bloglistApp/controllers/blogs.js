const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
  const blogsInDB = await Blog.find({}).populate('user', {username:1, name:1, id:1})
  return response.json(blogsInDB)
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
  const userMakingUpdate = request.user

  if (blogNewLikes.user.toString() === userMakingUpdate._id.toString() ){
    const updatedLikesBlog = await Blog
      .findByIdAndUpdate(request.params.id, blogNewLikes,
        { new: true,
          runValidators: true,
          context: 'query'
        })
    return response.json(updatedLikesBlog)
  }

  return response.status(401).end()
})



module.exports = blogsRouter