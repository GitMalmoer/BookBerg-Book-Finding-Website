import React, { useEffect, useState } from "react";
import bookModel from "../../Interfaces/bookModel";
import { JsxElement } from "typescript";
import axios from "axios";
import BookDetails from "./BookDetails";

// TODO when user goes back with breadcrumb then it goes directly to place in a long list

interface Props {
  booksList: bookModel[];
  setNavigationString: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
  navigationString : JSX.Element | undefined;
}

// https://www.googleapis.com/books/v1/volumes?q=inauthor:Noite.pl
function BookResults(props: Props) {
  const { booksList,navigationString,setNavigationString } = props;
  const [listToRender, setListToRender] = useState<bookModel[]>([]);

  const [selectedBook,setSelectedBook] = useState<bookModel>();
  const [selectedTitle,setSelectedTitle] = useState<JSX.Element>();
  const [selectedAuthor,setSelectedAuthor] = useState<JSX.Element>();
  const [selectedSearch,setSelectedSearch] = useState<JSX.Element>();
  const [fetchLoading,setFetchLoading] = useState(false);
  const [navigateToSearch, setNavigateToSearch] = useState(false);


  useEffect(() => {
    setListToRender(booksList);
  }, [booksList]);

  useEffect(() => {
    setNavigationString(<div className="d-flex">{selectedSearch} / {selectedAuthor ?? "Author Unknown"}</div>);
  },[fetchLoading])

  useEffect(() => {
    console.log("SEEEARCCH NNAAAVIGATE")

    setSelectedBook(undefined);
    setListToRender(booksList);
    setNavigationString(<div className="d-flex">{selectedSearch}</div>);
    setNavigateToSearch(false);
  },[navigateToSearch])


  const handleRowClick = (book: bookModel) => {
    setSelectedBook(book);
    prepareNavigation(book);
  };

  const prepareNavigation = (book: bookModel) => {
    const author = book.volumeInfo?.authors?.at(0);
    const authorQuery = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}`;
    const bookTitle = book?.volumeInfo?.title;

    setSelectedSearch(<a
        className="mx-2"
        onClick={() => setNavigateToSearch(true)}
        style={{ cursor: "pointer" }}
      >
        Search
      </a>);

      setSelectedAuthor(<a
        className="mx-2"
        style={{ cursor: "pointer" }}
        onClick={() => handleAuthorsNavigation(authorQuery)}
      >
        {author}
      </a>)

      setSelectedTitle(<a className="mx-2">{bookTitle}</a>);

    // set up navigation string
    const navigationString = (
      <div className="d-flex">
        <a
          className="mx-2"
          onClick={() => setNavigateToSearch(true)}
          style={{ cursor: "pointer" }}
        >
          Search
        </a>
        /
        {author ? <a
          className="mx-2"
          style={{ cursor: "pointer" }}
          onClick={() => handleAuthorsNavigation(authorQuery)}
        >
          {author}
        </a> : " Author Unknown "}
        /<a className="mx-2">{bookTitle}</a>
      </div>
    );

    setNavigationString(navigationString);
  };

  const handleAuthorsNavigation = async (authorQuery: string) => {
    setFetchLoading(true);
    setSelectedBook(undefined);
    const response = await axios.get(authorQuery);

    if (response.data) {
      setListToRender(() => response?.data?.items);
    }

     console.log(selectedAuthor?.props);
    setFetchLoading(false);
  };


const tableJsx =   <div>
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
                ? (book?.volumeInfo?.authors?.length > 1 ? book?.volumeInfo?.authors?.at(0) +
                  " and " +
                  (book?.volumeInfo?.authors!.length - 1)+
                  " more" : book?.volumeInfo?.authors?.at(0))
                : "Author Unknown"}{" "}
            </td>
            <td>{book?.volumeInfo?.publishedDate ?? "Unknown"}</td>
          </tr>
        );
      })}
  </tbody>
</table>
</div>

  return (
    <div>
      {selectedBook ? <BookDetails selectedBook={selectedBook}/> : tableJsx}
    </div>
  );
}



export default BookResults;
