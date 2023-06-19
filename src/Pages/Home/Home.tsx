import React, { useEffect, useState } from "react";
import "./home.css";
import BookFinder from "../../Components/BookFinder/BookFinder";
import About from "../About/About";
import { NavHashLink, HashLink } from "react-router-hash-link";

function Home() {
  const [userInput, setUserInput] = useState<string>("");
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState<any>(null);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSearchClick = () => {
    if(isSearchButtonClicked == null)
    {
      console.log("IF " +isSearchButtonClicked);
      setIsSearchButtonClicked(false);
    }
    else
    {
      console.log("ELSE " + isSearchButtonClicked);
      setIsSearchButtonClicked(!isSearchButtonClicked);
    }
  };

  

  return (
    <>
      <form onSubmit={(e) => {handleSearchClick(); e.preventDefault()}}>
        <div className="home">
          <div className="row h-100 ms-2">
            <div className="col-lg-6 col-md-6 offset-md-3 col-12 ">
              <div className="header d-flex flex-column justify-content-center align-items-center h-100 ">
                <div className="header-title">
                  <h1>BookBerg it now!</h1>
                </div>
                <div className="header-text  mx-2 ">
                  Unlock the door to endless possibilities through the power of
                  BookBerging.
                </div>
                <div className="input-group input-search  mt-2">
                  <HashLink
                    to={"#bookfinder"}
                    className="search-icon fs-4"
                    style={{ color: "black" }}
                  >
                    <i onClick={handleSearchClick} className="bi bi-search"></i>
                  </HashLink>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => handleUserInput(e)}
                    className="form-control shadow-lg p-2"
                    style={{ borderRadius: "23px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <About />
      <BookFinder
        searchUserInput={userInput}
        isSearchButtonClicked={isSearchButtonClicked}
      />
    </>
  );
}

export default Home;
