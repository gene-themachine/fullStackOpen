import { useState } from 'react';
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog , removeBlog, user}) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    updateBlog(returnedBlog)
  }

  const toggleVisibility = async () => {
    setVisible(!visible); // Toggle the visibility state
  };

  const handleDelete = async () => {
   if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`) ) {

      try{
        await blogService.deleteThisBlog(blog.id)

        removeBlog(blog.id);
      }
      catch(error){
        console.log("error deleting the blog, " (error))
      }
    }
  }
    

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button className='viewButton' onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick = {handleLike}>like</button></p>
          <p>{blog.author}</p>

          {user && blog.user && blog.user.id === user.id && (
            <button onClick={handleDelete}>delete</button> 
          )}
          
        </div>
      )}
    </div>
  );
};

export default Blog;
