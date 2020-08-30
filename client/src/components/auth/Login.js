import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors  //send back errors
      });
    }
  }
  handleChange = (event) => {
    const target = event.target;
    const name = target.id;
    const value = target.value;
    this.setState({ [name]: value });
  };
  onSubmit = (event) => {
    event.preventDefault();

    const payload = {
      email: this.state.email,
      password: this.state.password,
    };

    //console.log(payload);
    this.props.loginUser(payload); //send user data to props
  };
  render() {
    const { errors } = this.state;
return (
      <div>
          <div className="container">
            <div className="row">
              <div className="col-8 ">

                <div className="col s12" >
                  <h4>
                    <b>Login</b> below
                  </h4>
                  <p className="grey-text text-darken-1">
                    Don't have an account? <Link to="/register">Register</Link>
                  </p>
                </div>
                <form className="login-form" noValidate onSubmit={this.onSubmit}>
          <h2>Register</h2>
          <hr />

          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={this.state.email}
              error={errors.email}
              onChange={this.handleChange}
              className={classnames("", {
                invalid: errors.email || errors.emailnotfound
              })}
            />
                <label htmlFor="email">Email</label>
                <span className="redtext">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
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
                invalid: errors.password || errors.passwordincorrect
              })}
            />
                <span className="redtext">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block btn-lg">
             Log In
            </button>
          </div>
          <div className="text-center">Don't have an account yet?<Link to="/register">Click here to register</Link></div>
        </form>
              </div>
            </div>
          </div>
      </div>
    );
  }

}
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  export default connect(
    mapStateToProps,
    { loginUser }
  )(Login);