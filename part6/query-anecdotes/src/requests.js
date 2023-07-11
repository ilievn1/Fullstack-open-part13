import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnec =>
  axios.post(baseUrl, newAnec).then(res => res.data)
  
export const updateAnecdote = updatedAnec =>
  axios.put(`${baseUrl}/${updatedAnec.id}`, updatedAnec).then(res => res.data)