import React from "react";
import "./about.css";

function About() {
  return (
    <div className="about-section px-4 pt-5 my-5 text-center ">
      <h1 className="display-4 fw-bold text-body-emphasis">About BookBerg</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          In a world full of endless possibilities and vast knowledge, finding
          books is like embarking on a grand adventure, and the{" "}
          <strong>BookBerg</strong> is your trusty compass. It holds the power
          to unlock a universe of information, stories, and wisdom that can
          transform your life.
        </p>
      </div>

      <div
        className="overflow-hidden d-none d-md-block"
        style={{ minHeight: "295px", maxHeight: "310px" }}
      >
        <div className="container px-5 d-flex align-items-center justify-content-center">
          <div
            className="img-container rounded-3 shadow-lg mb-4"
            style={{ width: "700px", height: "320px" }}
          />
        </div>
      </div>

      <div className="d-block d-md-none">
        <div
          className="img-container rounded-3 shadow-lg mb-4"
          style={{ width: "100%", height: "320px" }}
        />
      </div>
    </div>
  );
}

export default About;
