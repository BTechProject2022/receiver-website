import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div className="container text-center  mt-15">
        <div className="row">
          <div className="col-sm-12 mt-5">
            <h1>This is the Receiver Website</h1>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-sm-12">
            <Link to="/register" className="btn btn-large btn-dark hoverable">
              Register
            </Link>
            <Link to="/login" className="btn btn-large btn-dark hoverable ml-5">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;
