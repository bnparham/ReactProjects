import React from 'react'

export default function Options({question, dispatch, answer}) {
    const hasAnswer = answer !== null
  return (
    <div className='options'>
        {question.options.map((opt, index) => (
            <button 
            className={`
                btn btn-option 
                ${index === answer && "answer"}
                ${hasAnswer && (index === question.correctOption ? "correct" : "wrong")}
            `
            }
            disabled={hasAnswer}
            onClick={() => (dispatch({type:"newAnswer", payload:index}))}>{opt}
            </button>
        ))}
    </div>
  )
}
