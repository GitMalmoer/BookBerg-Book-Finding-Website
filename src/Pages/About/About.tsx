import React from "react";
import "./about.css";
import ladyreadin from "../../Assets/ladyreadin.jpg";

function About() {
  return (
    <div className="px-4 pt-5 my-5 text-center border-bottom">
      <h1 className="display-4 fw-bold text-body-emphasis">About</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">Feel free to test my web app.</p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
          <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">
            Primary button
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg px-4"
          >
            Secondary
          </button>
        </div>
      </div>
      <div className="overflow-hidden" style={{ maxHeight: "40vh" }}>
        <div className="container px-5 d-flex align-items-center justify-content-center">
          <div
            className="img-container rounded-3 shadow-lg mb-4"
            style={{ width: "700px", height: "320px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default About;
