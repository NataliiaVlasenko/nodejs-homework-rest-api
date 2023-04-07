const express = require("express");
const controller = require("../../controllers/contactControllers");
const router = express.Router();
const { ctrlWrapper } = require("../../utils/ctrlWrapper");
const authCheck = require("../../middlewares/auth");

router.get("/", authCheck, ctrlWrapper(controller.getContacts));

router.get("/:id", authCheck, ctrlWrapper(controller.getContact));

router.post("/", authCheck, ctrlWrapper(controller.addContact));

router.put("/:id", authCheck, ctrlWrapper(controller.updateContact));

router.patch(
  "/:id/favorite",
  authCheck,
  ctrlWrapper(controller.updateStatusContact)
);

router.delete("/:id", authCheck, ctrlWrapper(controller.removeContact));

module.exports = router;
