const express = require("express");
const controller = require("../../controllers/authControllers");
const { ctrlWrapper } = require("../../utils/ctrlWrapper");
const authCheck = require("../../middlewares/auth");
const bodyValidation = require('../../middlewares/bodyValidation');

const router = express.Router();

router.post("/register", bodyValidation, ctrlWrapper(controller.register));

router.post("/login", ctrlWrapper(controller.login));

router.get("/current", authCheck, ctrlWrapper(controller.getCurrent));

router.get("/logout", authCheck, ctrlWrapper(controller.logout));

module.exports = router;
