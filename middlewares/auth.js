const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { CreateError } = require("../utils/createError");

const { SECRET_KEY } = process.env;

const authCheck = async (req, _, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(CreateError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      next(CreateError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(CreateError(401, "Not authorized"));
  }
};

module.exports = authCheck;
