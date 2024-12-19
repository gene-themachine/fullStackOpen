const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')


usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;
  
    if (!username || username.length < 3) {
      return response.status(400).json({ error: "username must be at least 3 characters long" });
    }
  
    if (!password || password.length < 3) {
      return response.status(400).json({ error: "password must be at least 3 characters long" });
    }
  
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(400).json({ error: "username must be unique" });
    }
  
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    const user = new User({
      username,
      name,
      passwordHash,
      blogs: [], // Initialize as an empty array
    });
  
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  });
  

//get function
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1})
    
    response.json(users)
})

module.exports = usersRouter