import { useDispatch } from "react-redux"
import {  createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleCreate = async (event) => {
        event.preventDefault()
        const content = event.target.newAnecInput.value
        event.target.newAnecInput.value = ''
        dispatch(createAnecdote(content))
        dispatch(setNotification(`you added ${content}`, 3))
    }

    return (
        <div>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
        <div><input name='newAnecInput'/></div>
        <button type="submit">create</button>
        </form>
    </div>
    )
}

export default AnecdoteForm