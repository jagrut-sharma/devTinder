const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, userName, email, password } = req.body;

  if (!firstName || !userName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a strong password");
  }
};

module.exports = { validateSignupData };
