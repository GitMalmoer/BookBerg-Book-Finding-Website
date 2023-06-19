import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import bookModel from "../../Interfaces/bookModel";
import inputHelper from "../Utils/inputHelper";
import MainLoader from "../Utils/MainLoader";
import "./bookFinder.css";
import Table from "./BookResults";
import { NavLink } from "react-router-dom";
import BookResults from "./BookResults";
import toastNotify from "../Utils/toastNotify";

interface props {
  isSearchButtonClicked: boolean;
  searchUserInput: string;
}

function BookFinder({ isSearchButtonClicked, searchUserInput }: props) {
  const initialApi = "https://www.googleapis.com/books/v1/volumes?q=";

  const [errorMessage, setErrorMessage] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [booksList, setBooksList] = useState<bookModel[]>([]);
  const [navigationString, setNavigationString] = useState<JSX.Element>(
    <div className="d-flex">
      <NavLink className="navigation-header mx-1" to={"/"}>
        Search
      </NavLink>
    </div>
  );

  const [userInput, setUserInput] = useState({
    searchInput: "",
    selectBooksPerPage: 10,
  });

  // SET STATE OF BOOKS PER PAGE WHENEVER CHANGE
  useEffect(() => {
    setBooksPerPage(userInput.selectBooksPerPage);
  }, [userInput.selectBooksPerPage]);

  // WHENEVER USER INPUT IN SEARCH BOX CHANGES THEN SET STATE
  useEffect(() => {
    setUserInput((prev) => ({ ...prev, searchInput: searchUserInput }));
  }, [searchUserInput]);

  // handling user input with helper method
  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  // setting initial value of 'isSearchButtonClicked' to false to not trigger UseEffect on 'isSearchButtonClicked' when it changes.
  useEffect(() => {
    console.log("initial render");
    console.log(isSearchButtonClicked);
    //isSearchButtonClicked = false;
    console.log(isSearchButtonClicked);
  }, []);

  // WHENEVER IS BUTTON CLICKED IN PARENT COMPONENT
  useEffect(() => {
    if (isSearchButtonClicked != null) {
      searchButtonClick();
    }
  }, [isSearchButtonClicked]);

  // ACTUAL FUNCTION WHEN SEARCH BUTTON IS CLICKED
  const searchButtonClick = async () => {
    console.log("search button action invoked");
    setCurrentPage(1);
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

  // FETCHING DATA WHEN USER CLICKS LOAD MORE BOOKS
  const loadMoreBooksClick = () => {
    setCurrentPage((prev) => prev + 1);
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    fetchBooks(booksPerPage, indexOfFirstBook);
  };

  // FETCHING BOOKS METHOD
  const fetchBooks = async (booksPerPage: number, startIndex: number) => {
    setLoading(true);
    let response;

    if (!userInput.searchInput) {
      setErrorMessage("Provide search in the input field above!");
      toastNotify("Provide search in the input field above!", "error");
      setLoading(false);
      return;
    }

    let searchApi =
      initialApi +
      userInput.searchInput +
      `&startIndex=${startIndex}&maxResults=${booksPerPage}`;

    response = await axios.get(searchApi);
    console.log(response);

    if (response?.data?.totalItems == 0) {
      toastNotify(
        "Cant find any books. Change your search value to continue.",
        "error"
      );
      setLoading(false);
      return;
    }

    if (response.data) {
      let items: bookModel[];

      if (Array.isArray(response.data.items)) {
        items = response.data.items;
      } else {
        toastNotify(
          "Cant find any books. Change your search value to continue.",
          "error"
        );
        setLoading(false);
        return;
      }

      setBooksList((prev: any) => [...prev, ...items]);
      console.log(booksList);
    }

    setLoading(false);
  };

  return (
    <div className="bookfinder-main row " id="bookfinder">
      <div className="col-12 col-md-10 offset-md-1 ps-0 pe-0">
        <div className="another d-block d-md-none d-flex flex-wrap">
          Navigation:
          <nav className="mx-2">{navigationString && navigationString} </nav>
        </div>
        {errorMessage ? (
          <p className="text-danger text-center mb-0 ">{errorMessage}</p>
        ) : (
          <p style={{ height: "23px", marginBottom: "0px" }}></p>
        )}
        <div className="card ">
          {loading && <MainLoader />}
          <div className="card-header ">
            <div className="d-flex justify-content-between">
              <div className="d-none d-md-block d-flex flex-wrap">
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
              loadMoreBooksClick={loadMoreBooksClick}
              booksPerPage={booksPerPage}
            ></BookResults>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookFinder;
