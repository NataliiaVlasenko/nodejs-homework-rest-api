const { User, schemas } = require("../models/user");
const CreateError = require("../utils/createError");
const sendEmail = require("../utils/sendEmail");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

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
  const verificationToken = uuidv4();

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Підтвердження реєстрації",
    html: `<a target='_blank' href='http://localhost:3000/api/auth/verify/${verificationToken}'>Натисніть для підтвердження реєстрації</a>`,
  };

  await sendEmail(mail);

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
  if (!user.verify) {
    throw new CreateError(401, "Email not verified");
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
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
};

const getCurrent = (req, res) => {
  const { name, email } = req.user;
  res.json({
    name,
    email,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new CreateError(404);
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: "",
    verify: true,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const { error } = schemas.email.validate({ email });
  if (error) {
    throw new CreateError(400, "missing required field email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CreateError(404);
  }

  if (user.verify) {
    throw new CreateError(400, "Verification has already been passed");
  }

  const mail = {
    to: email,
    subject: "Підтвердження реєстрації на сайті",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${user.verificationToken}">Натисніть для підтвердження реєстрації</a>`,
  };

  await sendEmail(mail);
  res.json({
    message: "Verification email sent",
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  verifyEmail,
  resendVerifyEmail,
};
