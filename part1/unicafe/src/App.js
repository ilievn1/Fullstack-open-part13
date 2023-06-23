import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) => {
  // conditionally format if percentage value needed
  if (text==='positive') {
    return(
      <tr>
        <td>{text}</td>
        <td>{value} % </td>
      </tr>
    )
  }
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

// a proper place to define a component
const Statistics = ({good, neutral, bad}) => {
  let all =  good + neutral + bad
  let avgVotes = (good - bad)*(1.0)/all
  let positivePerc = (all===0) ? 0 : (good/all)*100.0

  if (all===0) {
    return (
      <div>
        <p>No feedback givne</p>
      </div>
    )
  }

  return(
    <div>
      <table>
        <thead>
          <tr>
            <th>Statistics</th>
          </tr>
        </thead>
        
        <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={avgVotes} />
        <StatisticLine text="positive" value={positivePerc}/>
        </tbody>

      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good+1)} text='good'/>
      <Button handleClick={() => setNeutral(neutral+1)} text='neutral'/>
      <Button handleClick={() => setBad(bad+1)} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App