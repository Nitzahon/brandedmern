import React, { Component } from "react";
import { Link } from "react-router-dom";
class Navbar extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-5"></div>
        <nav className="col-2">
          <div className="">
          <Link to="/" className="btn btn-primary">
                  HOME
                </Link>
          </div>
        </nav>
        <div className="col-5"></div>
      </div>
    );
  }
}
export default Navbar;