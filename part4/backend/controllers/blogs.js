const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')




blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('users', {username : 1, name: 1, id: 1})
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }
  

  const users = await User.find({});
  if (users.length === 0) {
    return response.status(400).json({ error: "No users available to associate with the blog" });
  }


  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Default to 0 if likes is missing
    users: user._id, // Associate with the user's ID
  })


  const savedBlog = await blog.save()


  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog)

})


blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  // Ensure the blog's user matches the token's user
  if (blog.users.toString() !== decodedToken.id) {
    return response.status(403).json({ error: 'only the creator can delete this blog' });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});


blogRouter.put('/:id', async(request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }


  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedBlog)
})




module.exports = blogRouter