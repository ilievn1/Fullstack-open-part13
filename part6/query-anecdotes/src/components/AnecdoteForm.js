import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import NotificationContext, { notificationChange, notificationClear } from '../NotificationContext'
import { useContext } from 'react'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const [notification, dispatch] = useContext(NotificationContext)

  const newAnecMutation = useMutation(createAnecdote, {
    onSuccess: (newAnec) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnec))
      
      dispatch(notificationChange(`anecdote "${newAnec.content}" added`))
      setTimeout(() => {
        dispatch(notificationClear())
      }, 5000)
    },
    onError: () => {
      dispatch(notificationChange(`too short anecdote, must have length 5 or more`))
      setTimeout(() => {
        dispatch(notificationClear())
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecMutation.mutate({content, votes: 0})
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
