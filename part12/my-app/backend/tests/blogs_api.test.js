const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const app = require('../app')

const api = supertest(app)

let validHeaderOfCreator
let validCreatorId

let validHeaderOfNonCreator

beforeAll(async () => {
  await User.deleteMany({})
  // All sample blogs will be init with creator ID
  const creator = helper.initialUsers[0]
  const nonCreator = helper.initialUsers[1]

  const registeredCreator = await api.post('/api/users').send(creator)
  await api.post('/api/users').send(nonCreator)

  validCreatorId = registeredCreator.body.id

  const generatedCreatorToken = await api.post('/api/login').send(creator)
  const generatedNonCreatorToken = await api.post('/api/login').send(nonCreator)

  validHeaderOfCreator = {
    'authorization': `Bearer ${generatedCreatorToken.body.token}`
  }

  validHeaderOfNonCreator = {
    'authorization': `Bearer ${generatedNonCreatorToken.body.token}`
  }

})


beforeEach(async () => {
  await Blog.deleteMany({})
  const blogsWithSampleUser = helper.initialBlogs.map(blog => ({...blog, user: validCreatorId}))
  const blogObjects = blogsWithSampleUser.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set(validHeaderOfCreator)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('each blog has property \'id\'', async () => {
  const notes = await helper.blogsInDb()
  notes.forEach(note => {
    expect(note).toHaveProperty('id')
  })
})

test('blog addition increments DB blogs count and returns the new blog', async () => {
  const blogToBeAdded = {
    title: 'Suomi24',
    author: 'Suomi24',
    url: 'https://www.suomi24.fi/',
    likes: 17,
  }
  
  const returnedBlog = await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .set(validHeaderOfCreator)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const modifiedBlogs = await helper.blogsInDb()

  expect(modifiedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  expect(modifiedBlogs).toContainEqual(returnedBlog.body)
})

test('blog addition w/o \'likes\' property defaults to 0', async () => {
  const blogToBeAdded = {
    title: 'Suomi24',
    author: 'Suomi24',
    url: 'https://www.suomi24.fi/'
  }
    
  const returnedBlog =
    await api
      .post('/api/blogs')
      .send(blogToBeAdded)
      .set(validHeaderOfCreator)
      .expect(201)
      .expect('Content-Type', /application\/json/)


  const modifiedBlogs = await helper.blogsInDb()
      
  expect(modifiedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  expect(modifiedBlogs).toContainEqual(returnedBlog.body)
  expect(returnedBlog.body).toHaveProperty('likes', 0)


})

test('blog addition w/o \'title\' and/or \'url\' properties returns 400 status code', async () => {
  const blogToBeAdded = {
    title: 'Suomi24',
    url: 'https://www.suomi24.fi/'
  }
    
  await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .set(validHeaderOfCreator)
    .expect(400)
})

test('blog addition w/o token returns 401 status code', async () => {
  const blogToBeAdded = {
    title: 'Blog post with Missing Token',
    author: 'Blog post with Missing Token',
    url: 'https://www.owls.com/',
    likes: 177,
  }
  // erroneous due to validHeader not being added to req  
  await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .expect(401)
})

test('blog deletion succeeds with status code 204 if id is valid or 400 if invalid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  
  // valid ID scenario
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set(validHeaderOfCreator)
    .expect(204)
  
  // Invalid ID
  await api
    .delete(`/api/blogs/${helper.nonExistingId}`)
    .set(validHeaderOfCreator)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  expect(blogsAtEnd).not.toContainEqual(blogToDelete)

})

test('blog deletion by non creator fails with status code 401 ', async () => {
  const blogsAtStart = await helper.blogsInDb()
  
  // valid ID scenario
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set(validHeaderOfNonCreator)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  expect(blogsAtEnd).toContainEqual(blogToDelete)

})

test('blog \'likes\' update (PUT REQ) by creator is successful', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  
  const returnedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({...blogToUpdate, likes: blogToUpdate.likes + 1000})
    .set(validHeaderOfCreator)
    .expect(200)
    .expect('Content-Type', /application\/json/)    
    
  const modifiedBlogs = await helper.blogsInDb()

  expect(modifiedBlogs).toContainEqual(returnedBlog.body)
  expect(returnedBlog.body).toHaveProperty('likes', blogToUpdate.likes + 1000)
})

test('blog \'likes\' update (PUT REQ) by wrong user is unsuccessful', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({...blogToUpdate, likes: blogToUpdate.likes + 1000})
    .set(validHeaderOfNonCreator)
    .expect(401)
    
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})


afterAll(async () => {
  await mongoose.connection.close()
})