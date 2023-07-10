import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {

    const anecdotes = useSelector(({anecdotes, filter}) => {
      const allSorted = [...anecdotes].sort((a, b) => b.votes - a.votes)
      return filter  === '' 
        ? allSorted
        : allSorted.filter(anec => anec.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const dispatch = useDispatch()
  
    const handleVote = (anecObj) => {
      dispatch(voteAnecdote(anecObj))
      dispatch(setNotification(`you voted ${anecObj.content}`, 3))

    }
    return (
        <div>
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

export default AnecdoteList