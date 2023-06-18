import React from "react";
import "./home.css";
import BookFinder from "../../Components/BookFinder/BookFinder";
import About from "../About/About";
import { NavHashLink, HashLink } from 'react-router-hash-link';

function Home() {

  const onSearchIconClick = () => {

  }
  
  return (
    <>
      <div className="home">
        <div className="row h-100 ms-2">
          <div className="col-6 h-100">
            <div className="header d-flex flex-column justify-content-center align-items-center h-100">
              <div className="header-title">
                <h1>Find your very own book!</h1>
              </div>
              <div className="header-text mx-2">
                Unlock the door to endless possibilities through the power of
                reading. Each page holds a gateway to new worlds, profound
                insights, and transformative experiences
              </div>
              <div className="input-group w-50 mt-2">
                <HashLink to={"#bookfinder"} className="search-icon fs-4" style={{ color: "black" }}>
                  <i onClick={onSearchIconClick} className="bi bi-search"></i>
                </HashLink>
                
                <input
                  type="text"
                  className="form-control w-50 p-2"
                  style={{ borderRadius: "23px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <About />
      <BookFinder />
    </>
  );
}

export default Home;
