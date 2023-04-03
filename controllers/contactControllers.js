const { Contact} = require("../models/contact");
const { CreateError } = require("../utils/createError");


const getContacts = async (req, res) => {
  const result = await Contact.find();
  res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};

const getContact = async (req, res) => {
  
  const contactId = req.params.id;
  const result = await Contact.findById(contactId);
  console.log(result);
  if (!result) {
    throw new CreateError(404, `Contact with id - ${contactId} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);

  res.status(201).json({
    status: "success",
    code: 201,
    data: { result },
  });
};

const updateContact = async (req, res) => {
  const contactId  = req.params.id;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw new CreateError(404, `Contact with id - ${contactId} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};

const updateStatusContact = async (req, res) => {
  const contactId  = req.params.id;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw new CreateError(404, `Contact with id - ${contactId} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};


const removeContact = async (req, res) => {
  const contactId  = req.params.id;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw new CreateError(`Contact with id - ${contactId} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};

module.exports = {
  getContacts,
  getContact,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
};
