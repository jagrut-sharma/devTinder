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

const validateEditProfileData = (req) => {
  const editsAllowed = [
    "lastName",
    "userName",
    "photoUrl",
    "aboutUs",
    "skills",
  ];

  const isAllowedEditsPresent = Object.keys(req.body).every((key) =>
    editsAllowed.includes(key)
  );

  const isAboutUsLengthValid = req.body.aboutUs
    ? req.body.aboutUs.length < 150
    : true;

  const isUrlValid = req.body.photoUrl
    ? validator.isURL(req.body.photoUrl)
    : true;

  const isSkillsLengthValid = req.body.skills
    ? req.body.skills.length < 10
    : true;

  const isEditAllowed =
    isAboutUsLengthValid &&
    isUrlValid &&
    isSkillsLengthValid &&
    isAllowedEditsPresent;

  return isEditAllowed;
};

const validateEditPassword = (newPassword) => {
  const isEditingPasswordAllowed = validator.isStrongPassword(newPassword);

  return isEditingPasswordAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
  validateEditPassword,
};
