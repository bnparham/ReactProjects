import React from 'react'

export default function FinishScreen({points, maxPoints, dispatch, highScore, tryCount}) {
    const percentage = (points / maxPoints) * 100
    let emoji;
    if(percentage === 100) emoji='🥇'
    else if(percentage<100 && percentage>=80) emoji='🥈'
    else if(percentage<80 && percentage>=50) emoji='🥉'
    else if(percentage<50 && percentage>0) emoji='🗿'
    else emoji='💩'
  return (
    <>
      <p className='result'>
      {emoji} You scored {points} out of {maxPoints} Points ({Math.ceil(percentage)}%)
      </p>
      <p className='result'>
      Your High Score is {highScore} with {tryCount} Try.
      </p>
      <button onClick={() => dispatch({type:'reset'})} className='btn btn-ui'>Reset</button>
    </>
  )
}
