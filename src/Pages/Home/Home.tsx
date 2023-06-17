import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import bookModel from "../../Interfaces/bookModel";
import inputHelper from "../../Components/Utils/inputHelper";
import MainLoader from "../../Components/Utils/MainLoader";
import "./Home.css";
import Table from "../../Components/BookSearcher/BookResults";
import { NavLink } from "react-router-dom";
import BookResults from "../../Components/BookSearcher/BookResults";

function Home() {
  const initialApi = "https://www.googleapis.com/books/v1/volumes?q=";

  // QUERY https://www.googleapis.com/books/v1/volumes?q=a&startIndex=15&maxResults=40

  const [errorMessage, setErrorMessage] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [booksList, setBooksList] = useState<bookModel[]>([]);
  const [navigationString, setNavigationString] = useState<JSX.Element>(<div className="d-flex"><NavLink className="navigation-header mx-1" to={"/"}>Search</NavLink></div>);

  const [userInput, setUserInput] = useState({
    searchInput: "",
    selectBooksPerPage: 10,
  });

  useEffect(() => {
    setBooksPerPage(userInput.selectBooksPerPage);
  }, [userInput.selectBooksPerPage]);

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  // useEffect(() => {
  //   setBooksList([]);
  //   setNavigationString(<div className="d-flex"><NavLink className="navigation-header mx-1" to={"/"}>Search</NavLink></div>);
  // }, [userInput.searchInput]);

  const searchButtonClick = async () => {
    setBooksList([]);
    setNavigationString(
      <div className="d-flex">
        <NavLink className="navigation-header mx-1" to={"/"}>
          Search
        </NavLink>
      </div>
    );
    setErrorMessage("");
    setCurrentPage((prev) => 1);
    await fetchBooks(booksPerPage, startIndex);
  };

  const loadMoreBooksClick = () => {
    setCurrentPage((prev) => prev + 1);
    const indexOfLastBook = currentPage * booksPerPage;
    console.log("last book" + indexOfLastBook);
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    console.log("first book" + indexOfFirstBook);

    fetchBooks(booksPerPage, indexOfFirstBook);
  };

  const fetchBooks = async (booksPerPage: number, startIndex: number) => {
    setLoading(true);
    let response;

    if (!userInput.searchInput) {
      setErrorMessage("Provide search input!");
      setLoading(false);
      return;
    }

    let searchApi =
      initialApi +
      userInput.searchInput +
      `&startIndex=${startIndex}&maxResults=${booksPerPage}`;

    console.log(searchApi);

    response = await axios.get(searchApi);

    console.log(response);

    if (response.data) {
      const items: bookModel[] = response?.data?.items;
      setBooksList((prev: any) => [...prev, ...items]);
      console.log(booksList);
    }

    console.log(response);

    setLoading(false);
  };

  return (
    <div className="row ">
      <div className="col-10 offset-1 my-2">
        <div className="d-flex justify-content-start ">
          <input
            placeholder="Search here"
            className="form-control w-25"
            type="text"
            onChange={(e) => handleUserInput(e)}
            name="searchInput"
            value={userInput.searchInput}
          ></input>
          <button
            onClick={() => searchButtonClick()}
            className="btn btn-success mx-2"
          >
            Search
          </button>
        </div>
      </div>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <div className="col-10 offset-1">
        <div className="card">
          {loading && <MainLoader />}
          
          <div className="card-header ">
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                Navigation:
                <nav className="mx-2">
                  {navigationString && navigationString}{" "}
                </nav>
              </div>

              <div className="d-flex ">
                <p className="my-auto mx-2">Books Per Page:</p>
                <select
                  style={{ width: "67px" }}
                  className="form-select form-select-sm "
                  onChange={(e) => handleUserInput(e)}
                  value={userInput.selectBooksPerPage}
                  name="selectBooksPerPage"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-body">
            <BookResults
              navigationString={navigationString}
              setNavigationString={setNavigationString}
              booksList={booksList}
              loadMoreBooksClick = {loadMoreBooksClick}
              booksPerPage = {booksPerPage}
            ></BookResults>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
