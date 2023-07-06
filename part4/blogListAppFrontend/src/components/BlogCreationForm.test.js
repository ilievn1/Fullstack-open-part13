import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreationForm from './BlogCreationForm.js'

test('<BlogCreationForm /> updates parent state and calls onSubmit', async () => {
  const mockCreateHandler = jest.fn()
  const user = userEvent.setup()

  render(<BlogCreationForm handleBlogCreate={mockCreateHandler} />)

  const form = screen.getByRole('form')
  const [titleInput, authorInput, urlInput] = form.querySelectorAll('input')

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'testing title')
  await user.type(authorInput, 'testing author')
  await user.type(urlInput, 'testing url')
  await user.click(createButton)


  expect(mockCreateHandler.mock.calls).toHaveLength(1)
  expect(mockCreateHandler.mock.calls[0][0].title).toBe('testing title')
  expect(mockCreateHandler.mock.calls[0][0].author).toBe('testing author')
  expect(mockCreateHandler.mock.calls[0][0].url).toBe('testing url')

})