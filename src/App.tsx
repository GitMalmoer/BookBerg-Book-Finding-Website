import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Routes,Route} from 'react-router-dom';
import BookFinder from './Components/BookFinder/BookFinder';
import Home from './Pages/Home/Home';
 
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
      </Routes>
      </>
  );
}

export default App;
