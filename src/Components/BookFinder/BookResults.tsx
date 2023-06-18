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
  const [authorsCurrentPage, setAuthorsCurrentPage] = useState<number>(1);
  const [isAuthorBooksViewActive, setIsAuthorBooksViewActive] = useState(false);
  const [selectedBook, setSelectedBook] = useState<bookModel>();
  const [selectedTitleJsx, setSelectedTitleJsx] = useState<JSX.Element>();
  const [selectedAuthorJsx, setSelectedAuthorJsx] = useState<JSX.Element>();
  const [selectedSearchJsx, setSelectedSearchJsx] = useState<JSX.Element>();
  const [selectedAuthor,setSelectedAuthor] = useState<any | undefined>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [navigateToSearch, setNavigateToSearch] = useState(false);
  const [navigateToAuthor, setNavigateToAuthor] = useState(false);

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
  // useEffect(() => {
  //   if (fetchLoading == true) {
  //     console.log("fetch loading true");
  //     setNavigationString(
  //       <div className="d-flex navigation-header">
  //         {selectedSearchJsx} / {selectedAuthorJsx ?? "Author Unknown"}
  //       </div>
  //     );
  //   }
  // }, [fetchLoading]);

  // WHEN USER CLICKS GIVEN AUTHOR BREADCRUMB
  useEffect(() => {
    if(navigateToAuthor == true)
    {
      const authorQuery = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${selectedBook?.volumeInfo.authors?.at(0)}`;
      handleAuthorsNavigation(authorQuery);

      setNavigationString(
        <div className="d-flex navigation-header">
          {selectedSearchJsx} / {selectedAuthorJsx ?? "Author Unknown"}
        </div>
      );
    }
    setNavigateToAuthor(false);
  },[navigateToAuthor])


  // WHEN USER CLICKS SEARCH BREADCRUMB
  useEffect(() => {
    if (navigateToSearch == true) {
      setIsAuthorBooksViewActive(false);
      setListOfAuthors([]);
      setSelectedBook(undefined);
      setListToRender(booksList);
      setNavigationString(
        <div className="d-flex navigation-header">{selectedSearchJsx}</div>
      );
      setNavigateToSearch(false);
    }
  }, [navigateToSearch]);

   // WHEN USER CLICKS ON A ROW
  const handleRowClick = (book: bookModel) => {
    setSelectedBook(book); // SELECTED BOOK IS SAVED IN STATE
    prepareNavigation(book);
    console.log(book);
  };

  // PREPARING THE NAVIGATION BREADCRUMB WHEN THE ROW IS CLICKED
  const prepareNavigation = (book: bookModel) => {
    const author = book.volumeInfo?.authors?.at(0);
    setSelectedAuthor(author);
    const bookTitle = book?.volumeInfo?.title;
    
    // CHANGING BREADCRUMB STATES **START**
    setSelectedSearchJsx(
      <a
        className="mx-1 navigation-header"
        onClick={() => setNavigateToSearch(true)}
        style={{ cursor: "pointer" }}
      >
        Search
      </a>
    );

    setSelectedAuthorJsx(
      <a
        className="mx-1 navigation-header"
        style={{ cursor: "pointer" }}
        onClick={() => setNavigateToAuthor(true)}
      >
        {author}
      </a>
    );

    setSelectedTitleJsx(<a className="mx-1 navigation-header">{bookTitle}</a>);
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
            onClick={() => setNavigateToAuthor(true)}
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
      console.log("list full")
      setListToRender(listOfAuthors);
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

  const loadMoreAuthorBooks = async () => {
    console.log("Implement it")

    // fetch authors with given query
    // whenever this is clicked then add page count 

    // initialApi +
    // userInput.searchInput +
    // `&startIndex=${startIndex}&maxResults=${booksPerPage}`;

    setAuthorsCurrentPage((prev) => prev + 1);
    // TO DO ^ THIS ONE ZEROE IT 
    const indexOfLastBook = authorsCurrentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    const query = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${selectedAuthor}&startIndex=${indexOfFirstBook}&maxResults=${booksPerPage}`;

    const list : any = await fetchAuthors(query);

    if(list && list?.length > 1)
    {
      setListOfAuthors([...listOfAuthors,...list]);
      setListToRender([...listOfAuthors,...list]);
    }
    console.log(list);
  }

  const buttonLoadMoreBooksJsx =(<button
  className="buttonLoadMoreBooks py-2 mb-2 btn btn-outline-secondary rounded-5"
  onClick={() => loadMoreBooksClick()}
>
 Load More Books <i className="bi bi-book ms-1"></i>
</button>);

const buttonLoadMoreAuthorBooksJsx =(<button
  className="buttonLoadMoreBooks py-2 mb-2 btn btn-outline-secondary rounded-5"
  onClick={() => loadMoreAuthorBooks()}
>
Load More books of {selectedAuthor}<i className="bi bi-book ms-1"></i>
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
