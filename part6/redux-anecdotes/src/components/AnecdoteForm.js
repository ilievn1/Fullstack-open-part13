import { useDispatch } from "react-redux"
import { add } from '../reducers/anecdoteReducer'


const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleCreate = (event) => {
        event.preventDefault()
        const content = event.target.newAnecInput.value
        event.target.newAnecInput.value = ''
        dispatch(add(content))
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