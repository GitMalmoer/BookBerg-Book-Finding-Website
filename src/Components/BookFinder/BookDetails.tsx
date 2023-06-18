import React, { useEffect, useState } from "react";
import bookModel from "../../Interfaces/bookModel";

interface BookDetailProps {
  selectedBook: bookModel;
}

function BookDetails({ selectedBook }: BookDetailProps) {
  const [authorsList, setAuthorsList] = useState<JSX.Element>();

  useEffect(() => {
    generateAuthors();
  }, []);

  const generateAuthors = () => {
    const authors = selectedBook?.volumeInfo?.authors?.map(
      (author: any, index: number) => {
        return <span key={index}>{author}&nbsp;</span>;
      }
    );

    if (authors && authors?.length < 5) {
      setAuthorsList(<div className="d-flex text-success ">{authors}</div>);
    } else if (authors && authors?.length > 5) {
      const firstFiveAuthors = authors.slice(0, 5);

      setAuthorsList(
        <div>
          <div className="d-flex text-success">
            {firstFiveAuthors} and {authors.length - 5} more{" "}
          </div>
          <p>
            <button
              onClick={() =>
                setAuthorsList(
                  <div className="d-flex text-success flex-wrap">{authors}</div>
                )
              }
              style={{ borderRadius: "23px" }}
              className="btn btn-primary"
            >
              Load all Authors
            </button>
          </p>
        </div>
      );
    } else {
      setAuthorsList(<div className="text-success">Author Unknown"</div>);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-2">
          <img
            style={{ borderRadius: "5%" }}
            src={
              selectedBook.volumeInfo.imageLinks?.thumbnail ??
              "http://books.google.com/books/content?id=ubdWzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            }
            alt="Book Image"
          />
        </div>

        <div className="col-10" style={{ textAlign: "left" }}>
          <h2>{selectedBook?.volumeInfo?.title}</h2>

          <span className="d-flex"><i className="bi bi-person me-1"></i>{authorsList}</span>

          {selectedBook?.volumeInfo?.publishedDate && (
            <div className="mt-0">
              <i className="bi bi-calendar me-1"></i>Published date: {selectedBook?.volumeInfo?.publishedDate}
            </div>
          )}
          <div className="mt-0">
          <i className="bi bi-list-ol me-1"></i>Pages count: {selectedBook?.volumeInfo?.pageCount}
          </div>
          {selectedBook?.volumeInfo?.publisher && (
            <div className="mt-0">
              <i className="bi bi-building "></i> Publisher: {selectedBook?.volumeInfo?.publisher}
            </div>
          )}
        </div>
      </div>

      <div className="row mt-2" style={{ textAlign: "left" }}>
        <div className="col-12 ">{selectedBook.volumeInfo.description}</div>
      </div>
    </>
  );
}

export default BookDetails;
