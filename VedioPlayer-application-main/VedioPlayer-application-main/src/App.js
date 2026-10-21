// import axios from 'axios';
import { useState, useEffect } from 'react';
import Videoplayer from './components/Videoplayer';
import {exerciseOptions} from './database';
import { FaSquareGithub } from "react-icons/fa6";


function App() {
  const [movies, setmovies] = useState([])
  // const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001/videos';
  // const accessToken = "126ecbe925504312b193c01a4fe3af3c"

  //uncomment to use local server
    // const fetchMovies = async()=>{
    //     // const response = await axios.get('http://127.0.0.1:3001/videos');
      
    //     // const response = await axios.get('https://api.spotify.com/',
    //     // {
    //     //   headers: {
    //     //     Authorization: `Bearer ${accessToken}`
    //     //   }
    //     // });


    //     const response = await axios.get(apiUrl);
    //     setmovies(response.data);
    // }
    // useEffect(()=>{
    //     fetchMovies()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[])


 // without using local sever 
  useEffect(()=>{
    setmovies(exerciseOptions);
  },[]);
    
  return (
    <div className="m-4 min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-2">
      
      <Videoplayer movies = {movies}/>

      <div className='flex justify-center items-center gap-2'>
        <a href='https://github.com/ShantinathK/' className='text-4xl'>
          <FaSquareGithub />
        </a>
        <h1>click here to access github</h1>
      </div>
    </div>
  );
}

export default App;
