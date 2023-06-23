import { useState } from 'react'

const Button = ({handleVote, text}) => (
  <button onClick={handleVote}>
    {text}
  </button>
)

const Display = ({text, format}) => {
  if (format==='h1') {
    return (
      <div>
        <h1>{text}</h1>
      </div>
  )
  }else if (format==='p') {
    return (
      <div>
        <p>{text}</p>
      </div>
    )
  }
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array.apply(null, Array(anecdotes.length)).map(() => 0))
  let randIdx = Math.floor(Math.random() * anecdotes.length)
  let largestVoteIdx = points.indexOf(Math.max.apply(null, points))

  const vote = () => () => {
    const copy = [...points]
    copy[selected]+=1
    setPoints(copy)
  }

  return (
    <div>
      <Display text='Anecdote of the day' format='h1'/>

      <Display text={anecdotes[selected]} format='p'/>
      <Display text={`has ${points[selected]} votes`} format='p'/>

      <Button handleVote={vote()} text='vote' />
      <Button handleVote={() =>setSelected(randIdx)} text='next anecdote' />
      <br/>

      <Display text='Anecdote with most votes' format='h1'/>

      <Display text={`${anecdotes[largestVoteIdx]}`} format='p'/>
      <Display text={`has ${points[largestVoteIdx]} votes`} format='p'/>

    </div>
  )
}

export default App