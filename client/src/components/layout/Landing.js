import React, { Component } from "react";
import { Link } from "react-router-dom";
class Landing extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
            <div className="col-3"></div>
          <div className="col-6">
            <h4>
              <b>Build</b> a login/auth app with the{" "}
              <span className="monos">MERN</span> stack from scratch
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Create a (minimal) full-stack app with user authentication via
              passport and JWTs
            </p>
            <br />
            <div className="row">
              <div className="col-3"></div>
              <div className="col-6">
                <Link to="/register" className="btn btn-primary link">
                  Register
                </Link>
              </div>
              <div className="col-3"></div>
            </div>
            <br/>
            <div className="row">
              <div className="col-3"></div>
              <div className="col-6">
                <Link to="/login" className="btn btn-primary link">
                  Log In
                </Link>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    );
  }
}
export default Landing;
