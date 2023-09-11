import { useEffect, useRef, useState } from "react";
import StarRating from './components/StarRating';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from "./useKey";

const KEY = 'ad4f0c7d'

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  
export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('');
  const [error, setError] = useState('')
  const [selectMovieId, setSelectMovieId] = useState(null)
  const [watched, setWatched] = useLocalStorageState([], "watched")

  useEffect(
    function(){
      if(query.length < 3){
        setMovies([])
        setError('')
        setIsLoading(false)
        return
      }
      const controller = new AbortController();
      async function fetchMovie(){
        try {
          setIsLoading(true)
          setError('')
          const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {signal : controller.signal}
          )
          if(!res.ok){
            throw new Error("❌ field to fetch data")
          }
          const data = await res.json();
          if(data.Response === 'False'){
            throw new Error("❌ Movie Not Found ! ")
          }
          setMovies(data.Search)
          setError('')
        } catch (error) {
          if(error.name !== "AbortError"){setError(error.message)}
        }
        finally{
          setIsLoading(false)
        }
      }
      fetchMovie()
      return function () {
        controller.abort();
      };
    },[query]
  );

  const handleAddWatched = (movie) => {
    setWatched(oldMovies => [...oldMovies, movie])
  }

  const handleRemoveWatched = (id) => {
    setWatched(watched => watched.filter(
      movie => movie.imdbID !== id
    ))
  }

  const handleOpenSelectMovie = (id) => {
    setSelectMovieId(
      id === selectMovieId ? null : id
    )
  }

  const handleCloseSelectedMovie = () => {
    setSelectMovieId(null)
  }

  return (
    <>
      <Nav>
        <SearchBar query={query} setQuery={setQuery} />
        <NavResult movies={movies}/>
      </Nav>
      <Main>
        <Box>
          {
          error ? 
          <ErrorMessage message={error}/> :
          isLoading ?
          <Loader/> : 
          <MovieList movies={movies} handleOpenSelectMovie={handleOpenSelectMovie}/>
          }
        </Box>
        <Box>
          {
            selectMovieId ?
            (<MovieSelectd 
            id={selectMovieId}
            handleCloseSelectedMovie={handleCloseSelectedMovie}
            handleAddWatched={handleAddWatched}
            watched={watched}
            />)
            :
            (
            <>
            <Summary watched={watched}/>
            <WatchedList watched={watched} handleRemoveWatched={handleRemoveWatched}/>
            </>
            )
          }
        </Box>
      </Main>
    </>
  );
}

const MovieSelectd = ({id, handleCloseSelectedMovie, handleAddWatched, watched}) => {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')
  const isWatched = watched.map(
    m => m.imdbID
  ).includes(id)
  const {
    Title : title,
    Year : year,
    Released : released,
    Runtime: runtime,
    Genre: genrer,
    Director: director,
    Writer: writer,
    Actors: actors,
    Plot: plot,
    imdbRating,
    Metascore : metascore,
    Poster: poster,
  } = movie
  useEffect(
    function(){
      async function getMovieDetails(){
        setIsLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}`)
        const data = await res.json()
        setMovie(data)
        setIsLoading(false)
        // console.log(data);
      }
      getMovieDetails()
    },
    [id]
  )
  useEffect(
    function(){
      document.title = `Movile | ${title}`
      return function(){
        document.title = "usePopcorn"
      }
    },
    [title]
  )

  useKey('Escape', handleCloseSelectedMovie)

  const handleAdd = () => {
    const watchedMovie = {
      imdbID: id,
      Title : title,
      Year : year,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      Poster: poster,
      userRating,
    };
    handleAddWatched(watchedMovie)
    handleCloseSelectedMovie()

}

  return(
    <div className="details">
      {
        isLoading ? <Loader/>
        :
        (
          <>
          <header>
          <button className="btn-back" onClick={() => handleCloseSelectedMovie()}>
            &larr;
          </button>
          <img src={poster} alt={title}/>
          <div className="details-overview">
            <h2>{title}</h2>
            <p>{released} &bull; {runtime}</p>
            <p>{genrer}</p>
            <p>
              <span>⭐</span>
              {imdbRating} IMdb rating
            </p>
            <p>
              <span>⏳</span>
              MetaScore : {metascore}
            </p>
          </div>
          </header>
          <section>
            <div className="rating">
              {
                !isWatched ? 
                <>
                <StarRating maxRating={10} size={24} onSetRate={setUserRating}/>
                {
                userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
                }
                </>
                :
                <p>You alredy watched this movie</p>
              }
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              Staring {actors}
            </p>
            <p>
              Directed by {director}
            </p>
          </section>
          </>
        )
      }
    </div>
  )
}

const ErrorMessage = ({message}) => {
  return(
    <p className="error">{message}</p>
  )
}

const Box = ({children}) => {
  const [isOpen, setIsOpen] = useState(true);
  return(
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  )
}

const Main = ({children}) => {
  return(
    <main className="main">
      {children}
    </main>
  )
}

const Nav = ({children}) => {
  return(
    <nav className="nav-bar">
    <Logo />
    {children}
    </nav>
  )
}

const Summary = ({watched}) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
      <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

const Loader = () => {
  return(
    <p className="loader">Loading...</p>
  )
} 
const Watched = ({movie, handleRemoveWatched}) => {
  return(
      <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={()=>handleRemoveWatched(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  )
}

const Movie = ({movie,handleOpenSelectMovie}) => {
  return(
      <li key={movie.imdbID} onClick={() => handleOpenSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

const MovieList = ({movies,handleOpenSelectMovie}) => {

  return(
    <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} handleOpenSelectMovie={handleOpenSelectMovie}/>
    ))}
  </ul>
  )
}

const WatchedList = ({watched, handleRemoveWatched}) => {
  return(
      <ul className="list">
      {watched.map((movie) => (
        <Watched movie={movie} key={movie.imdbID} handleRemoveWatched={handleRemoveWatched}/>
      ))}
    </ul>
  )
}

const Button = ({isOpen,setIsOpen}) => {
  return(
    <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
    >
    {isOpen ? "–" : "+"}
    </button>
  )
}

const Logo = () => {
  return(
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
    </div>
  )
}

const SearchBar = ({query, setQuery}) => {
  const inputEl = useRef(null)

  useKey('Enter', function(){
    if(document.activeElement === inputEl.current) return;
    inputEl.current.focus()
    setQuery("")
  })

  useKey('Escape', function(){
    if(document.activeElement === inputEl.current){
      inputEl.current.blur()
    }
  })

  // useEffect(function(){
  //   const callback_Enter = (e) => {
  //     if (e.code === "Enter"){
  //       if(document.activeElement === inputEl.current) return;
  //       inputEl.current.focus()
  //       setQuery("")
  //     }
  //   }
  //   const callback_Esc = (e) => {
  //     if(document.activeElement === inputEl.current){
  //       if (e.code === "Escape"){
  //         inputEl.current.blur()
  //       }
  //     }
  //   }
  //   document.addEventListener('keydown', callback_Enter)
  //   document.addEventListener('keydown', callback_Esc)
  //   return () => 
  //   {
  //     document.removeEventListener('keydown', callback_Enter)
  //   }
  // },[setQuery])

  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={inputEl}
    />
  )
}

const NavResult = ({movies}) => {
  return(
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
    </p>
  )
}