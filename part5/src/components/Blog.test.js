import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.js'

test('renders default blog contents', () => {
  const testUsr = {
    username: 'root',
    name: 'root'
  }
  const testBlog = {
    user: testUsr,
    likes: 47,
    author: 'Ron Jeremy',
    title: 'Devtrium',
    url: 'http://www.devtrium.com'
  }


  const { container } = render(<Blog
    blog={testBlog}
    currUsr={testUsr}
    handleLike={() => console.log('Like handled')}
    handleDelete={() => console.log('Delete handled')}
  />)

  const defaultView = container.querySelector('.blogContents')
  const extendedView = screen.getByTestId('extendedView')

  expect(defaultView).toHaveTextContent('Devtrium')
  expect(defaultView).toHaveTextContent('Ron Jeremy')
  expect(extendedView).not.toBeVisible()
})

test('clicking the \'view\' btn shows the full blog info', async () => {
  const testUsr = {
    username: 'root',
    name: 'root'
  }
  const testBlog = {
    user: testUsr,
    likes: 47,
    author: 'Ron Jeremy',
    title: 'Devtrium',
    url: 'http://www.devtrium.com'
  }

  render(<Blog
    blog={testBlog}
    currUsr={testUsr}
    handleLike={() => console.log('Like handled')}
    handleDelete={() => console.log('Delete handled')}
  />)
  const extendedView = screen.getByTestId('extendedView')

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  expect(extendedView).toBeVisible()

  const likes = screen.getByText(/likes/i)
  const link = screen.getByText(/url/i)

  expect(likes).toBeDefined()
  expect(link).toBeDefined()
})

test('clicking the \'like\' btn twice calls event handler twice', async () => {
  const testUsr = {
    username: 'root',
    name: 'root'
  }
  const testBlog = {
    user: testUsr,
    likes: 47,
    author: 'Ron Jeremy',
    title: 'Devtrium',
    url: 'http://www.devtrium.com'
  }
  const mockHandler = jest.fn()

  render(<Blog
    blog={testBlog}
    currUsr={testUsr}
    handleLike={mockHandler}
    handleDelete={() => console.log('Delete handled')}
  />)


  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})