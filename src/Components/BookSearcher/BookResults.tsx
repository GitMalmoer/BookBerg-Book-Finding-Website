import React, { useEffect, useState } from "react";
import bookModel from "../../Interfaces/bookModel";
import { JsxElement } from "typescript";
import axios from "axios";

// TODO when user goes back with breadcrumb then it goes directly to place in a long list



interface Props {
  booksList: bookModel[];
}

function BookDetails() {
  
  return (
    <div>BookDetails</div>
  )
}

// https://www.googleapis.com/books/v1/volumes?q=inauthor:Noite.pl
function Table(props: Props) {
  const { booksList } = props;
  const [listToRender, setListToRender] = useState<bookModel[]>([]);
  const [navigationString, setNavigationString] = useState<JSX.Element>();
  const [bookDetails,setBookDetails] = useState<bookModel>();
  const [selectedTitle,setSelectedTitle] = useState<JSX.Element>();
  const [selectedAuthor,setSelectedAuthor] = useState<JSX.Element>();
  const [selectedSearch,setSelectedSearch] = useState<JSX.Element>();
  const [fetchLoading,setFetchLoading] = useState(false);


  useEffect(() => {
    setListToRender(booksList);
  }, [booksList]);

  useEffect(() => {
    const navigation = <div className="d-flex">{selectedSearch} / {selectedAuthor}</div>;
    setNavigationString(navigation);

  },[fetchLoading])

  const handleRowClick = (book: bookModel) => {
    setBookDetails(book);
    prepareNavigation(book);
  };

  const prepareNavigation = (book: bookModel) => {
    const author = book.volumeInfo?.authors?.at(0);
    const authorQuery = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}`;
    const bookTitle = book?.volumeInfo?.title;

    setSelectedSearch(<a
        className="mx-2"
        onClick={() => handleSearchNavigation()}
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
          onClick={() => handleSearchNavigation()}
          style={{ cursor: "pointer" }}
        >
          Search
        </a>
        /
        <a
          className="mx-2"
          style={{ cursor: "pointer" }}
          onClick={() => handleAuthorsNavigation(authorQuery)}
        >
          {author}
        </a>
        /<a className="mx-2">{bookTitle}</a>
      </div>
    );

    setNavigationString(navigationString);
  };

  const handleAuthorsNavigation = async (authorQuery: string) => {
    setFetchLoading(true);
    const response = await axios.get(authorQuery);

    if (response.data) {
      setListToRender(() => response?.data?.items);
    }

     console.log(selectedAuthor?.props);
    setFetchLoading(false);
  };

  const handleSearchNavigation = () => {
    console.log(booksList);
    setListToRender(booksList);
  };

  return (
    <div>
      {(navigationString && !fetchLoading) && navigationString}
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
  );
}


function BookResults(props: Props) {
  const { booksList } = props;
  const [bookDetails,setBookDetails] = useState<bookModel>();
  return (
    <div>
      {bookDetails ? <BookDetails/> : <Table booksList={booksList}/>}
    </div>
  )
}

export default BookResults;
