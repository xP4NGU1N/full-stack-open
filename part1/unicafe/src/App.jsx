import { useState } from 'react'

const Header = ({title}) => <h1>{title}</h1>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value}) => <span>{text} {value}</span>

const Statistics = ({good, neutral, bad}) => {
  const total = good+neutral+bad
  if (!total) return (<><p>No feedback given</p></>)
  else { 
    return (
    <>
    <StatisticLine text="good" value={good}/><br></br>
    <StatisticLine text="neutral" value={neutral}/><br></br>
    <StatisticLine text="bad" value={bad}/><br></br>
    <StatisticLine text="all" value={total}/><br></br>
    <StatisticLine text="average" value={(good-bad)/total}/><br></br>
    <StatisticLine text="positive" value={`${good/total*100} %`} /><br></br>
    </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => {
    const newGood = good+1
    setGood(newGood)
  }

  const neutralClick = () => {
    const newNeutral = neutral+1
    setNeutral(newNeutral)
  }

  const badClick = () => {
    const newBad = bad+1
    console.log(newBad)
    setBad(newBad)
  }

  return (
    <div>
      <Header title="give feedback" />
      <Button onClick={goodClick} text="good"/>
      <Button onClick={neutralClick} text="neutral"/>
      <Button onClick={badClick} text="bad"/>
      <Header title="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App