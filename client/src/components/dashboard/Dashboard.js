//This Component is in a private route, only logged users can see it
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, getAllUsers } from "../../actions/authActions";
import axios from "axios";


class Dashboard extends Component {
  constructor(props) {
    super(props);
  this.state = {
  
    users: []
  };
}
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  componentDidMount() {
    this.props.getAllUsers();
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.users) {
      this.setState({
        users: [...nextProps.auth.users]
      });

    }
  }
  // getAllUsers = () =>{
  //   axios.get("/api/user/")
  //   .then((response)=>{
  //     const data=response.data;
  //     this.setState({users: data});
  //     console.log('we got data');
  //   })
  //   .catch(()=>{
  //     alert('something went wrong');
  //   });
  // }
render() {
    const { user } = this.props.auth;

return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into a full-stack{" "}
                <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
              </p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getAllUsers:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, getAllUsers }
)(Dashboard);