const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('correct number of notes are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 6)
})

test('blog contains unique ID', async () => {
  const response = await api.get('/api/blogs')
  const uniqueId = new Set(response.body.map(blog => blog.id))
  assert.strictEqual(uniqueId.size, helper.initialBlogs.length)
})

test('blog can be added to database', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'new url',
    likes: 1
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { author, likes, title, url } = response.body
  assert.deepStrictEqual({ author, likes, title, url }, newBlog)

  const getResponse = await api.get('/api/blogs')
  assert.strictEqual(getResponse.body.length, helper.initialBlogs.length+1)
})

test('blog defaults like to 0', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'new url'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog does not contain title or url', async () => {
  const newBlog1 = {
    author: 'new author 1',
    url: 'new url 1',
    likes: 1
  }

  const newBlog2 = {
    title: 'new blog 2',
    author: 'new author 2',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)
})

test('delete blog', async () => {
  const firstBlog = helper.initialBlogs[0]

  const response = await api
    .delete(`/api/blogs/${firstBlog._id}`)
    .expect(200)
  assert.strictEqual(response.body.id, firstBlog._id)

  const getResponse = await api.get('/api/blogs')
  assert.strictEqual(getResponse.body.length, helper.initialBlogs.length-1)
})

test('update blog', async () => {
  const firstBlog = helper.initialBlogs[0]
  const newBlog = { ...firstBlog, likes: firstBlog.likes+1 }

  const response = await api
    .put(`/api/blogs/${firstBlog._id}`)
    .send(newBlog)
    .expect(200)
  assert.strictEqual(response.body.likes, firstBlog.likes+1)
})


after(async () => {
  await mongoose.connection.close()
})