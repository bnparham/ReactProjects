import { useEffect, useReducer } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error'
import StartScreen from './components/StartScreen';
import Questions from './components/Questions';
import Progress from './components/Progress';
import NextButton from './components/NextButton';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

const SECS_PER_QUESTION = 30
const initState = {
  questions : [],
  // loading, error, ready, active, finished, reset
  status : 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  tryCount : 0,
  secondRemaining : null,
}
function reducer(state, action){
  switch(action.type){
    case 'dataRecived':
      return{
        ...state, 
        questions: action.payload,
        status: 'ready',
      }
    case 'dataFaild':
      return{
        ...state,
        status: 'error'
      }
    case 'start':
      return{
        ...state,
        status: 'active',
        secondRemaining : state.questions.length * SECS_PER_QUESTION
      }
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return{
        ...state,
        answer:action.payload,
        points:action.payload === question.correctOption 
          ?state.points + question.points 
          :state.points
      }
    case 'nextQuestion':
      return {...state, index:state.index+1, answer:null}
    case 'finish':
      return {...state, status:'finished', 
      highScore : state.points > state.highScore ? state.points : state.highScore,
      tryCount : state.tryCount + 1
    }
    case 'reset':
      return {...initState, 
        status : 'ready',
        questions:state.questions, 
        highScore:state.highScore, 
        tryCount:state.tryCount,
      }
    case 'tick':
      return {
      ...state, 
      secondRemaining : state.secondRemaining - 1,
    }
    default:
      throw new Error("Action Unkonwn")
  }
}

function App() {

  const [{questions, status, index, answer, points, highScore, tryCount, secondRemaining}, dispatch] = useReducer(reducer, initState)
  const numQuestions = questions.length
  const maxPoints = questions.reduce((prev, cur) => (prev + cur.points) , 0)
  const hasAnswer = answer !== null

  useEffect(
    function(){
      fetch("http://localhost:9000/questions")
      .then(res => res.json())
      .then(data => dispatch({type: 'dataRecived', payload:data}))
      .catch(err => dispatch({type: 'dataFaild'}))
    },
    []
  )

  return (
    <div className="app">
        <Header/>
        <Main>
            {status === 'loading' && <Loader />}
            {status === 'error' && <Error/>}
            {status === 'ready' && <StartScreen
              numQuestions={numQuestions} 
              dispatch={dispatch}
             />}
            {status === 'active' && 
            <>
              <Progress 
                index={index} 
                numQuestions={numQuestions} 
                points={points} 
                maxPoints={maxPoints} 
                answer={answer}/>
              <Questions 
                question={questions[index]} 
                dispatch={dispatch} 
                answer={answer}
              />
                <Footer>
                  {hasAnswer && 
                  <NextButton 
                    dispatch={dispatch} 
                    numQuestions={numQuestions} 
                    index={index} 
                  />}
                  <Timer dispatch={dispatch} secondRemaining={secondRemaining}/>
                </Footer>
            </>
            }
            {status === 'finished' &&
              <FinishScreen 
              points={points} 
              maxPoints={maxPoints} 
              dispatch={dispatch} 
              highScore={highScore} 
              tryCount={tryCount}
              />
            }
        </Main>
    </div>
  );
}

export default App;
