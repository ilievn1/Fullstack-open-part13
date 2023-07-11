import { useMutation, useQuery, useQueryClient } from 'react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import NotificationContext, { notificationChange, notificationClear } from './NotificationContext'
import { useContext } from 'react'

const App = () => {
  const [notification, dispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const updateAnecMutation = useMutation(updateAnecdote, {
    onSuccess: (updAnec) => {
      const anecdotes = queryClient.getQueryData('anecdotes')

      const anecArrWithUpdated = anecdotes.map(anec =>
        anec.id !== updAnec.id ? anec : updAnec)

      const sortedUpdated = anecArrWithUpdated.sort((a,b) => b.votes - a.votes)

      queryClient.setQueryData('anecdotes', sortedUpdated)
    }
  })
  const result = useQuery(
    'anecdotes',getAnecdotes, {
      retry: false
    })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    updateAnecMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    dispatch(notificationChange(`anecdote "${anecdote.content}" voted`))
    setTimeout(() => {
      dispatch(notificationClear())
    }, 5000)

  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
