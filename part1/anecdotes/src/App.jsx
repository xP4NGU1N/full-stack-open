import { useState } from 'react'

const MostVotes = ({anecdotes, votes}) => {
  let total = 0
  votes.forEach((vote)=>total+=vote)
  if (!total) return <h1>Start voting</h1>
  else {
    let highestIdx = 0
    let highestVotes = 0
    for (let i=0; i<votes.length; i++) {
      if (votes[i] > highestVotes) {
        highestVotes = votes[i]
        highestIdx = i
      }
    }
  
    return (
      <>
        <h1>Anecdote with most votes</h1>
        <p>{anecdotes[highestIdx]}</p>
      </>
    )
  }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  console.log(votes)

  const getRandomInt=(max)=>Math.floor(Math.random()*max)
  const updateVotes=(index)=>{
    const newVotes = [...votes]
    newVotes[index] += 1
    return newVotes
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p><br></br>
      <button onClick={()=>setVotes(updateVotes(selected))}>vote</button>
      <button onClick={()=>setSelected(getRandomInt(anecdotes.length))}>next anecdote</button>
      <MostVotes anecdotes={anecdotes} votes={votes} />

    </div>
  )
}

export default App