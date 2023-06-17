import React, { useEffect, useState } from "react";
import bookModel from "../../Interfaces/bookModel";
import { JsxElement } from "typescript";
import axios from "axios";
import BookDetails from "./BookDetails";
import MainLoader from "../Utils/MainLoader";

// TODO when user goes back with breadcrumb then it goes directly to place in a long list

interface Props {
  booksList: bookModel[];
  setNavigationString: React.Dispatch<React.SetStateAction<JSX.Element>>;
  navigationString: JSX.Element | undefined;
  loadMoreBooksClick: () => void;
  booksPerPage: number;
}

// https://www.googleapis.com/books/v1/volumes?q=inauthor:Noite.pl
function BookResults(props: Props) {
  const {
    booksList,
    navigationString,
    setNavigationString,
    loadMoreBooksClick,
    booksPerPage,
  } = props;

  const [listToRender, setListToRender] = useState<bookModel[]>([]);
  const [listOfAuthors,setListOfAuthors] = useState<bookModel[]>([]);
  const [authorsCurrentPage, setAuthorsCurrentPage] = useState();
  const [isAuthorBooksViewActive, setIsAuthorBooksViewActive] = useState(false);
  const [selectedBook, setSelectedBook] = useState<bookModel>();
  const [selectedTitle, setSelectedTitle] = useState<JSX.Element>();
  const [selectedAuthor, setSelectedAuthor] = useState<JSX.Element>();
  const [selectedSearch, setSelectedSearch] = useState<JSX.Element>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [navigateToSearch, setNavigateToSearch] = useState(false);

  // WHEN THERE IS A CHANGE IN BOOKS LIST OR WHEN THE USER SEARCHES FOR NEW BOOK.
  useEffect(() => {
    setListToRender(booksList);
    // when bookslist array changes to 0 then it goes back from the BookDetails.tsx view to list view
    if(booksList.length == 0){
      console.log("book list empty")
      setSelectedBook(undefined);
    }
  }, [booksList]);

  // WHEN GIVEN AUTHOR BOOKS ARE FETCHING FROM API
  useEffect(() => {
    console.log("fetch loading");
    if (fetchLoading == true) {
      setNavigationString(
        <div className="d-flex navigation-header">
          {selectedSearch} / {selectedAuthor ?? "Author Unknown"}
        </div>
      );
    }
  }, [fetchLoading]);


  // WHEN USER CLICKS SEARCH BREADCRUMB
  useEffect(() => {
    if (navigateToSearch == true) {
      setIsAuthorBooksViewActive(false);
      setSelectedBook(undefined);
      setListToRender(booksList);
      setNavigationString(
        <div className="d-flex navigation-header">{selectedSearch}</div>
      );
      setNavigateToSearch(false);
    }
  }, [navigateToSearch]);

   // WHEN USER CLICKS ON A ROW
  const handleRowClick = (book: bookModel) => {
    setSelectedBook(book); // SELECTED BOOK IS SAVED IN STATE
    prepareNavigation(book);
  };

  // PREPARING THE NAVIGATION BREADCRUMB WHEN THE ROW IS CLICKED
  const prepareNavigation = (book: bookModel) => {
    const author = book.volumeInfo?.authors?.at(0);
    const authorQuery = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}`;
    const bookTitle = book?.volumeInfo?.title;
    
    // CHANGING BREADCRUMB STATES **START**
    setSelectedSearch(
      <a
        className="mx-1 navigation-header"
        onClick={() => setNavigateToSearch(true)}
        style={{ cursor: "pointer" }}
      >
        Search
      </a>
    );

    setSelectedAuthor(
      <a
        className="mx-1 navigation-header"
        style={{ cursor: "pointer" }}
        onClick={() => handleAuthorsNavigation(authorQuery)}
      >
        {author}
      </a>
    );

    setSelectedTitle(<a className="mx-1 navigation-header">{bookTitle}</a>);
    // CHANGING BREADCRUMB STATES **END**

    // MANUAL SET UP OF INITIAL NAVIGATION STRING
    const navigationString = (
      <div className="d-flex">
        <a
          className="mx-1 navigation-header"
          onClick={() => setNavigateToSearch(true)}
          style={{ cursor: "pointer" }}
        >
          Search
        </a>
        /
        {author ? (
          <a
            className="mx-1 navigation-header"
            style={{ cursor: "pointer" }}
            onClick={() => handleAuthorsNavigation(authorQuery)}
          >
            {author}
          </a>
        ) : (
          " Author Unknown "
        )}
        /<a className="mx-1 navigation-header">{bookTitle}</a>
      </div>
    );

    setNavigationString(navigationString);
  };

  // This method is invoked when user navigates to given author. If authorslist is allready populated switch view if not then fetch data.
  const handleAuthorsNavigation = async (authorQuery: string) => {
    setIsAuthorBooksViewActive(true);
    if(listOfAuthors.length > 1)
    {
      setListToRender(listOfAuthors);
      setNavigationString(
        <div className="d-flex navigation-header">
          {selectedSearch} / {selectedAuthor ?? "Author Unknown"}
        </div>);
      setSelectedBook(undefined);
    }
    else
    {
      const givenAuthorBooks = await fetchAuthors(authorQuery);
      if(givenAuthorBooks.length > 1)
      {
        setListToRender(givenAuthorBooks);
        setListOfAuthors(givenAuthorBooks);
        setSelectedBook(undefined);
      }
    }
  };

  const fetchAuthors = async (authorQuery: string) => {
    setFetchLoading(true);
    const response = await axios.get(authorQuery);

    if (response.data) {
      setFetchLoading(false);
      return response?.data?.items;
    }
    else
    {
      setFetchLoading(false);
      return [];
    }
  }

  const buttonLoadMoreBooksJsx =(<button
  className="btn btn-primary m-2"
  onClick={() => loadMoreBooksClick()}
>
  Load More Books
</button>);

const buttonLoadMoreAuthorBooksJsx =(<button
  className="btn btn-primary m-2"
  onClick={() => loadMoreBooksClick()}
>
  Load More books of {selectedAuthor}
</button>);

  const tableJsx = (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {listToRender &&
            listToRender.map((book: bookModel, index: any) => {
              return (
                <tr
                  key={index}
                  className=""
                  onClick={() => handleRowClick(book)}
                >
                  <td id={book?.volumeInfo?.title}>
                    {book?.volumeInfo?.title ?? "Unknown"}
                  </td>
                  <td>
                    {book?.volumeInfo?.authors?.length
                      ? book?.volumeInfo?.authors?.length > 1
                        ? book?.volumeInfo?.authors?.at(0) +
                          " and " +
                          (book?.volumeInfo?.authors!.length - 1) +
                          " more"
                        : book?.volumeInfo?.authors?.at(0)
                      : "Author Unknown"}{" "}
                  </td>
                  <td>{book?.volumeInfo?.publishedDate ?? "Unknown"}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="d-flex align-content-center justify-content-center">
            {isAuthorBooksViewActive ? buttonLoadMoreAuthorBooksJsx : buttonLoadMoreBooksJsx }
      </div>
    </div>
  );

  return (
    <div>
      {fetchLoading && <MainLoader/>}
      {selectedBook ? <BookDetails selectedBook={selectedBook} /> : tableJsx}
    </div>
  );
}

export default BookResults;
