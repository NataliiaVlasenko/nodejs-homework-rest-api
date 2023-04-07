const { schemas } = require("../models/user");
const { CreateError } = require("../utils/createError");

const bodyValidation = async (req, _, next) => {
  try {
    const { error } = schemas.register.validate(req.body);
    if (error) {
      next(CreateError(400, error.message));
    }
  } catch (error) {
    next(CreateError(400, error));
  }
};

module.exports = bodyValidation;
