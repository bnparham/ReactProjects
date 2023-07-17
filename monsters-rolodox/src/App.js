// import logo from './logo.svg';
import './App.css';
import { Component,useState,useEffect } from 'react';
import CardList from './components/card-list/card-list.component';
import SearchBox from './components/search-box/search-box.component';


const App = () => {

  const [searchField,setSearchField] = useState('')
  const [monsters,setMonsters] = useState([])
  const [filterdMonsters,setFilterdMonsters] = useState(monsters)

  const onSearchChange = (e) =>{
    const searchFieldString = e.target.value.toLowerCase()
    setSearchField(searchFieldString)
  }

  console.log('renderd');

  useEffect(
    ()=>{
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(responose => responose.json())
        .then(users => setMonsters(users))
    },
    []
  )

  useEffect(
    ()=>{
      const NewfilterdMonsters = monsters.filter((monster)=>{
        return monster.name.toLowerCase().includes(searchField)
      })
      setFilterdMonsters(NewfilterdMonsters)
    },
    [monsters,searchField]
  )

  return(
      <div className="App">
        <h1 className='app-title'>Monster Rolodox</h1>
        <SearchBox onChangeHandeler={onSearchChange} placeHolder='search monsters' className='search-box'/>
        <CardList monsters={filterdMonsters} />
      </div>
  )
}


// class App extends Component {
//   constructor(){
//     super()
//     this.state = {
//       monsters : [],
//       searchField : '',
//     }
//     // console.log('constructor App.js');
//   }
//   componentDidMount(){
//     fetch('https://jsonplaceholder.typicode.com/users')
//       .then(responose => responose.json())
//       .then(users => this.setState(
//         () => {return {monsters : users}},
//       ))
//     // console.log('componentDidMount App.js');

//   }

//   onSearchChange = (e) =>{
//     const searchField = e.target.value.toLowerCase()
//     this.setState(
//       () => {
//         return {searchField}
//       },
//     )
//   }

//   render(){

//     // console.log('render App.js');

//     const {monsters,searchField} = this.state
//     const {onSearchChange} = this

//     const filterdMonsters = monsters.filter((monster)=>{
//       return monster.name.toLowerCase().includes(searchField)
//     })

//     return (
//       <div className="App">
//         <h1 className='app-title'>Monster Rolodox</h1>
//         <SearchBox onChangeHandeler={onSearchChange} placeHolder='search monsters' className='search-box'/>
//         <CardList monsters={filterdMonsters} />
//       </div>
//     );
//   }
// }

export default App;
