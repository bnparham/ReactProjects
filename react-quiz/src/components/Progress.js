import React from 'react'

export default function Progress({index, numQuestions, points, maxPoints, answer}) {
  return (
    <header className='progress'>
        <progress max={numQuestions} value={index + Number(answer !== null)}/>
        <p>Question <strong>{index + Number(answer !== null)}</strong> / {numQuestions}</p>
        <p><strong>{points}</strong> / {maxPoints}</p>
    </header>
  )
}
