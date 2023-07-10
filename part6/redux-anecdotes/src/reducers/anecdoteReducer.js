import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = []


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    vote(state, action) {
      const updated = action.payload
      return state.map(anec =>
        anec.id !== updated.id ? anec : updated
      )     
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})
export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecArr = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecArr))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const postedAnec = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(postedAnec))
  }
}

export const voteAnecdote = toBeUpdatedAnecObj => {
  return async dispatch => {
    const updatedAnec = await anecdoteService.updateVotes(toBeUpdatedAnecObj)
    dispatch(vote(updatedAnec))
  }
}

export default anecdoteSlice.reducer