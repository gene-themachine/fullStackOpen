const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  // Clear the test database
  await Blog.deleteMany({})
  await User.deleteMany({})


  // Use Promise.all to seed initial blogs
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test("correct number of blogs are returned", async() => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  assert(blogs.length > 0) // Ensure there are blogs

  blogs.forEach(blog => {

    assert(blog.id) // Check that `id` exists
    assert(!blog._id) // `_id` should not exist
  })
})


test('number of blogs is increased by one', async () => {
  const newBlog = {
    title: "JAVASCRIPT",
    author: "gg",
    url: "httmp:120950",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})


test("testing if a blog lacks likes, it sets to 0", async () => {
  const newBlog = {
    title: "MISSING LIKES",
    author: "gg",
    url: "httm",

  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes ,0)

  // Verify that the blog is in the database

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)

})

test('fails with status code 400 if title is missing', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


test('fails with status code 400 if url is missing', async () => {
  const newBlog = {
    title: 'Missing URL Test',
    author: 'Test Author',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


test('is delete function successful?', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]



  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()


  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const contents = blogsAtEnd.map(r => r.content)

})


test('is put function successful', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToChange = blogsAtStart.find(blog => blog.author === "Jake" )


  const blog = {
    title: "JAVASCRIPT",
    author: "Jake",
    url: "httmp:ml1234",
    likes: 3
  }
  await api
    .put(`/api/blogs/${blogToChange.id}`)
    .send(blog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToChange.id)
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  assert.deepStrictEqual(updatedBlog, {...blogToChange, title: blog.title  })
})

test("name checking test", async () => {
  


  const testUser = {
    username: 'ALEX',
    name: 'Ge Pretty',
    password: "Hello",

  }

  await api
    .post('/api/users')
    .send(testUser)
    .expect(201)

  const namesAtStart = await helper.usersInDb()

  //user inserted
  const sameNameUser = {
    username: 'ALEX',
    name: 'Whoho',
    blogs: [],
    password: "woah",

  }

  await api
    .post('/api/users')
    .send(sameNameUser)
    .expect(400)

  const namesAtEnd = await helper.usersInDb()
  assert.strictEqual(namesAtStart.length,namesAtEnd.length)

})

test('fails with status code 400 if username is too short', async () => {
  const namesAtFirst = await helper.usersInDb()
  
  const newUser = {
    username: 'us',
    name: 'Test User',
    password: 'password123',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const namesAtEnd = await helper.usersInDb()

  assert.strictEqual(namesAtFirst.length, namesAtEnd.length)
})

test('fails with status code 400 if password is too short', async () => {
  const namesAtFirst = await helper.usersInDb()
  
  const newUser = {
    username: 'validusername',
    name: 'Test User',
    password: 'pw',
  }


  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const namesAtEnd = await helper.usersInDb()

  assert.strictEqual(namesAtFirst.length, namesAtEnd.length)
})







after(async () => {
  await mongoose.connection.close()
})