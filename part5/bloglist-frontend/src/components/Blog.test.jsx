import { render, screen } from '@testing-library/react'
import { expect, test, beforeEach, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'https://testing-library.com/',
  likes: 5
}

let container
beforeEach(() => {
  container = render(<Blog blog={blog} />).container
})

test('initially shows only title and author, hides url and likes', () => {
  const titleAndAuthor = screen.getByText(`${blog.title} ${blog.author}`, { exact: false })
  expect(titleAndAuthor).toBeDefined()

  // Check that url and likes are not rendered
  const url = screen.queryByText(blog.url)
  const likes = screen.queryByText(`likes ${blog.likes}`, { exact: false })

  
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('shows url and likes after clicking view button', async () => {
  const user = userEvent.setup()
  const button = container.querySelector('.viewButton')

  // Check elements are not visible initially
  const urlBefore = screen.queryByText(blog.url)
  const likesBefore = screen.queryByText(`likes ${blog.likes}`, { exact: false })
  expect(urlBefore).toBeNull()
  expect(likesBefore).toBeNull()

  await user.click(button)

  const urlAfter = screen.queryByText(blog.url)
  const likesAfter = screen.queryByText(`likes ${blog.likes}`, { exact: false })
  expect(urlAfter).toBeInTheDocument()
  expect(likesAfter).toBeInTheDocument()
})
// Does not work. 
// test('clicking like button twice calls event handler twice', async () => {
//   const blog = {
//     title: 'Test Blog',
//     author: 'Test Author',
//     url: 'http://testurl.com',
//     likes: 0,
//     user: {
//       id: '123',
//       username: 'testuser',
//       name: 'Test User'
//     }
//   }

//   const mockHandler = vi.fn()
//   const user = userEvent.setup()

//   const { container } = render(
//     <Blog 
//       blog={blog}
//       updateBlog={mockHandler}
//       removeBlog={() => {}}
//       user={{id: '123'}}
//     />
//   )

//   const viewButton = container.querySelector('.viewButton')
//   await user.click(viewButton)

//   const likeButton = screen.getByText('like')
//   await user.click(likeButton)
//   await user.click(likeButton)

//   expect(mockHandler.mock.calls).toHaveLength(2)
//   expect(mockHandler.mock.calls[0][0]).toEqual({
//     ...blog,
//     likes: 1
//   })
//   expect(mockHandler.mock.calls[1][0]).toEqual({
//     ...blog,
//     likes: 2
//   })
// })



//Does not work.


// test('creates new blog with correct details', async () => {
//     const createBlog = vi.fn()
//     const user = userEvent.setup()
  
//     render(<BlogForm createBlog={createBlog} />)
  
//     const titleInput = screen.getByPlaceholderText('write title here')
//     const authorInput = screen.getByPlaceholderText('write author here')
//     const urlInput = screen.getByPlaceholderText('write url here')
//     const createButton = screen.getByText('create')
  
//     await user.type(titleInput, 'Test Blog Title')
//     await user.type(authorInput, 'Test Author')
//     await user.type(urlInput, 'http://testblog.com')
//     await user.click(createButton)
  
//     expect(createBlog.mock.calls).toHaveLength(1)
//     expect(createBlog.mock.calls[0][0]).toEqual({
//       title: 'Test Blog Title',
//       author: 'Test Author',
//       url: 'http://testblog.com'
//     })
//   })