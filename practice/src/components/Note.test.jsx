import { render, screen } from '@testing-library/react'
import Note from './Note'
import userEvent from '@testing-library/user-event'
import NoteForm from './NoteForm'
import Togglable from './Togglable'

test('renders content',async () => {

    //creating a new note
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  //vi.fn() (Vitest's mock function) to create a mock for toggleImportance
  const mockHandler = vi.fn()


  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)

})

describe('<Togglable />', () => {
    let container
  
    beforeEach(() => {
      container = render(
        <Togglable buttonLabel="show...">
          <div className="testDiv" >
            togglable content
          </div>
        </Togglable>
      ).container
    })
  
    test('renders its children', async () => {
      await screen.findAllByText('togglable content')
    })
  
    test('at start the children are not displayed', () => {
      const div = container.querySelector('.togglableContent')
      expect(div).toHaveStyle('display: none')
    })
  
    test('after clicking the button, children are displayed', async () => {
      const user = userEvent.setup()
      const button = screen.getByText('show...')
      await user.click(button)
  
      const div = container.querySelector('.togglableContent')
      expect(div).not.toHaveStyle('display: none')
    })
  })


  test('<NoteForm /> updates parent state and calls onSubmit', async () => {
    const createNote = vi.fn()
    const user = userEvent.setup()
  
    render(<NoteForm createNote={createNote} />)

    const input = screen.getByPlaceholderText('write note content here')
    console.log(input)
    const sendButton = screen.getByText('save')
  
    await user.type(input, 'testing a form...')
    await user.click(sendButton)
  
    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
  })