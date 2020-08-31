//This Component is in a private route, only logged users can see it
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, getAllUsers } from "../../actions/authActions";
import FilterableTable from "react-filterable-table";



const fields = [
  { name: 'name', displayName: "Name",  },
  { name: 'age', displayName: "Age", inputFilterable: true,  sortable: true },
  { name: '_id', displayName: "ID",  },
  {name: 'email', displayName:'Email'}
];

const calculate_age =(dob) =>{ 
  var diff_ms = Date.now() - new Date(dob).getTime();
  var age_dt = new Date(diff_ms); 
  return Math.abs(age_dt.getUTCFullYear() - 1970);
} 

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


  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.users) {
      var tmp = [...nextProps.auth.users];
      console.log(tmp)
      tmp.forEach(function(element, index) {
        element.age = calculate_age(element['dateofbirth']);
        delete element['dateofbirth'];
    });
      console.log(tmp);
      this.setState({
        users:  [...tmp]
      });

    }
  }
  componentDidMount() {
    this.props.getAllUsers();
  }

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
            <br/>
            <div>

            <FilterableTable
    namespace="Users"
    initialSort="Age"
    data={this.state.users}
    fields={fields}
    noRecordsMessage="There are no people to display"
    noFilteredRecordsMessage="No people match your filters!"
/>
            </div>
            <br/>
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