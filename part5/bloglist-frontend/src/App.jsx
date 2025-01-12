import { useState, useEffect , useRef} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const[username, setUsername] = useState('')
  const[password, setPassword] = useState('')
  const[user, setUser] = useState(null)

  
  const[failMessage, setFailMessage] = useState(null)
  const[successMessage, setSuccessMessage] = useState(null)


  const blogFormRef = useRef()

  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  },[])

  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  
const updateBlog = (updatedBlog) => {
  setBlogs((prevBlogs) =>
    prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
  );
  
}

const removeBlog = (id) => {
  setBlogs((blogs) => blogs.filter((blog) => blog.id !== id));
  setSuccessMessage('Blog successfully removed');
  setTimeout(() => setSuccessMessage(null), 5000);


}



const handleAddBlog = async (newBlog) => {
  blogFormRef.current.toggleVisibility()

  try {
    const blog = await blogService.create(newBlog)
    setBlogs(blogs.concat(blog));

    
    setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added!`)
    setTimeout(() => setSuccessMessage(null), 5000)

  }
  catch {
    console.log('error')
  }
}
  
  const loginForm = () => (
    <form onSubmit= {handleLogin}>
      <div>
        username  
        <input
        type="text"
        value= {username}
        name= "Username"
        data-testid = "username" 
        onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          data-testid = "password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>


        
    </form>

  )


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch(exception) {
      setFailMessage(`wrong username or password`)
      setTimeout(() => setFailMessage(null), 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }



  return (
    <div>
      <Notification message = {successMessage} type = "success"/>
      <Notification message = {failMessage} type = "error"/>
      
      {user === null ? (
        <div>
          <h1>Log in to the application</h1>
          <div>
            {loginForm()}
          </div>
        </div>
      ) : (
        <div>
          <p>
            {user.name} logged-in
          </p>
          <h2>Blogs</h2>
          {sortedBlogs.map(blog => (


            <Blog key={blog.id} blog={blog} updateBlog = {updateBlog} removeBlog={removeBlog} user = {user}/>


          ))}

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog = {handleAddBlog}/>
          </Togglable>




          <button onClick= {logout}>
              logout
          </button>

        </div>
      )}
    </div>
  )
  
}

export default App