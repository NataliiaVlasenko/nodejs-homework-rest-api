const { User, schemas } = require("../models/user");
const { CreateError } = require("../utils/createError");
const gravatar = require('gravatar');

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new CreateError(409, `${email} is in use`);
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const result = await User.create({ ...req.body, password: hashPassword, avatarURL });
  res.status(201).json({
    user: {
      email: result.email,
      subscription: "starter",
    },
  });
};

const login = async (req, res) => {
  const { error } = schemas.login.validate(req.body);

  if (error) {
    throw new CreateError(400, error.message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CreateError(401, "Email or password is wrong");
  }

  const comparePassword = await bcryptjs.compare(password, user.password);
  if (!comparePassword) {
    throw new CreateError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).send();
};

const getCurrent = (req, res) => {
  const { name, email } = req.user;
  res.json({
    name,
    email,
  });
};

module.exports = { register, login, logout, getCurrent };
