import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import { withRouter } from 'react-router';


class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      dateofbirth: "",
      errors: {},
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.id;
    const value = target.value;
    this.setState({ [name]: value });
  };

  _onFocus = (e) => {
    e.currentTarget.type = "date"; //change to date type
    e.currentTarget.placeholder="dd-mm-yyyy"
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = yyyy + "-" + mm + "-" + dd;
    e.currentTarget.max = today; //make it not normally possible to choose date in the past
  };

  _onBlur = (e) => {
    e.currentTarget.type = "text";
    e.currentTarget.placeholder = "Select date ...";
    const target = e.target;
    const name = target.id;
    let value = target.value;
    let d1 = new Date();
    let d2 = new Date(value);
    if (d2 > d1) {
      //catch if date was changed to improper date in roundabout way
      value = "";

      console.log("Selected Date must be in the past");
    }

    this.setState({ [name]: value });
    // this.setState({ expiration: e.target.value });//remove stored date state if improper
  };
  onSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: this.state.name,
      email: this.state.email,
      dateofbirth: this.state.dateofbirth,
      password: this.state.password,
      password2: this.state.password2,
    };

    //console.log(payload);
    this.props.registerUser(payload, this.props.history); 
  };

  render() {
      const {errors} = this.state;
    //JSX
    return (
        <div className="row">
          <div className="col-4"></div>
      <div className="form-box col-4">
        <form className="signup-form" onSubmit={this.onSubmit}>
          <h2>Register</h2>
          <hr />
          <div className="form-group">
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              value={this.state.name}
              error={errors.name}
              onChange={this.handleChange}
              className={classnames("", {
                invalid: errors.name
              })}
            />
            <span className="redtext">{errors.name}</span>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={this.state.email}
              error={errors.email}
              onChange={this.handleChange}
              className={classnames("", {
                invalid: errors.email
              })}
            />
            <span className="redtext">{errors.email}</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="dateofbirth"
              placeholder="Date of Birth"
              value={this.state.dateofbirth}
              error={errors.dateofbirth}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              onChange={this.handleChange}
              className={classnames("", {
                invalid: errors.dateofbirth
              })}
            />
            <span className="redtext">{errors.dateofbirth}</span>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={this.state.password}
              error={errors.password}
              onChange={this.handleChange}
              className={classnames("", {
                invalid: errors.password
              })}
            />
            <span className="redtext">{errors.password}</span>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password2"
              placeholder="Confirm Password"
              value={this.state.password2}
              error={errors.password}
              onChange={this.handleChange}
              className={classnames("", {
                invalid: errors.password2
              })}
            />
            <span className="redtext">{errors.password2}</span>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Sign Up
            </button>
          </div>
          {/* <div className="text-center">Already have an account? <Link to="/login">Login here</Link></div> */}
        </form>
      </div>
      <div className="col-4"></div>
      </div>
    );
  }
}
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  //export too connect the register with the prop states
export default connect(
    mapStateToProps,
    { registerUser }
  )(withRouter(Register));