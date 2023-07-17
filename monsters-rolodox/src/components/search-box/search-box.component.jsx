import { Component } from "react";
import './search-box.style.css'


const SearchBox = (props) => (
    <input className={props.className} type='search' placeholder={props.placeHolder} onChange={props.onChangeHandeler}/>  
)

// class SearchBox extends Component{
//     render(){
//         return(
//             <input className={props.className} type='search' placeholder={props.placeHolder} onChange={props.onChangeHandeler}/>
//         )
//     }
// }

export default SearchBox