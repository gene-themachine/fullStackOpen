import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const[newTitle, setTitle] = useState('')
    const[newAuthor, setAuthor] = useState('')
    const[newUrl, setURL] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()
    
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <div>
      <h2>Create new</h2>

        <form onSubmit = {handleAddBlog}>
        <div>
        Title
        <input
            type="text"
            value= {newTitle}
            name ="Title"
            data-testid = "title-input"
            onChange= {({target}) => setTitle(target.value)}
        />
        </div>

        <div>
        Author
        <input
            type="text"
            value= {newAuthor}
            name ="author"
            data-testid = "author-input"
            onChange= {({target}) => setAuthor(target.value)}
        />
        </div>

        <div>
        url
        <input
            type="text"
            value= {newUrl}
            name ="URL"
            data-testid = "url-input"
            onChange= {({target}) => setURL(target.value)}
        />
        </div>
        <button type="submit">create</button>
    </form>
    </div>
  )
}

export default BlogForm