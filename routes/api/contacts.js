const express = require("express");
const controller = require("../../controllers/contactControllers");
const router = express.Router();
const { ctrlWrapper } = require("../../utils/ctrlWrapper");

router.get("/", ctrlWrapper(controller.getContacts));

router.get("/:id", ctrlWrapper(controller.getContact));

router.post("/", ctrlWrapper(controller.addContact));

router.put("/:id", ctrlWrapper(controller.updateContact));

router.patch("/:id/favorite", ctrlWrapper(controller.updateStatusContact));

router.delete("/:id", ctrlWrapper(controller.removeContact));

module.exports = router;
