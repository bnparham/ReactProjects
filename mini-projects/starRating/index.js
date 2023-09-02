import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import StarRating from './components/StarRating';
// import './index.css';
// import App from './App';

// Test Component with sending function
const Add = () => {
  const [movieRate, setMovieRate] = useState(0)
  return(
    <div>
      <StarRating maxRating={10} size={48} color='blue' onSetRate={setMovieRate}/>
      <p>You rate {movieRate} to this Movie</p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating size={48} message={['Trrible','Bad','Ok','Good','Amazing']} defaultRating={3}/>
    <StarRating size={24} color='red'/>
    <Add />
  </React.StrictMode>
);