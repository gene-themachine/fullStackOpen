const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: "HTML",
        author: "Joany",
        url: "httmp:ml1234",
        likes: 5
    },
    {
        title: "CSS",
        author: "Jake",
        url: "httmp:ml1234",
        likes: 3
    }
  ]


const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())

}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())

}




module.exports = {
    initialBlogs, blogsInDb, usersInDb
}