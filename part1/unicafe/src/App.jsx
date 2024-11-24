import { useState } from 'react'



const Button = ({handleClick, text} ) => (
  <button onClick = {handleClick}>{text}</button>
)

const StatisticalLine = ({text, value}) => (
  <tr>
    <td>{text} </td>
    <td>{value} </td>
  </tr>
)



const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  






  return (
    <div>
        <h1>give feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text = "good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text = "neutral"/>
        <Button handleClick={() => setBad(bad + 1)} text = "bad" /> 

        <h1>statistics</h1>

      
        <Statistics good = {good} bad = {bad} neutral = {neutral} />
        
    </div>
  )
}

const Statistics = ( {good, neutral, bad } ) => {
  const total = good + neutral + bad;

  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticalLine value = {good} text = "good" />
        <StatisticalLine value = {neutral} text = "neutral" />
        <StatisticalLine value = {bad} text = "bad" />
        <StatisticalLine text = "all" value = {total}/>
        <StatisticalLine text = "average" value  = { (good + (-1) * bad ) / (total) } />
        <StatisticalLine text = "positive" value={`${(good /total)} %`} />
        </tbody>
    </table>
  )

  
}


export default App