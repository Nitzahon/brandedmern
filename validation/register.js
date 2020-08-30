const validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.dateofbirth = !isEmpty(data.dateofbirth.toString())
    ? data.dateofbirth
    : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  // Name checks
  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  // Email checks
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Date of Birth checks
  if (validator.isEmpty(data.dateofbirth)) {
    errors.password = "Date of birth is required";
  }
  if (validator.isAfter(data.dateofbirth)) {
    errors.dateofbirth = "Date of birth must be in the past";
  }
  // Password checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  } else if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
