const adminAuth = (req, res, next) => {
  const token = "qwerty";
  const isAdminAuthorized = token === "qwerty";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "zxc";
  const isUserAuthorized = token === "zxc";

  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
