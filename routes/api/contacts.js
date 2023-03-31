const express = require('express')

const router = express.Router()

 const Contacts = require('../../models/contacts');
 
 const validate = require('../../utils/validation/contactValidationSchemas');


router.get('/', async (_req, res, next) => {
  try {
    
    const contacts = await Contacts.listContacts();
    return res.json({
      status: 'Success',
      code: 200,
      message: 'Contacts found',
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
});



router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: 200,
        message: 'Contact found',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
})



router.post('/', validate.createContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: 'Success',
      code: 201,
      message: 'Contact successfully created',
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: 200,
        message: 'Contact deleted',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = validate.validateBody(req.body);
    if (error) {
      return res.status(400).json({
        status: 'Error',
        code: 400,
        message: 'Missing fields',
      });
    }

    const result = await Contacts.updateContact(req.params.contactId, req.body);
    if (!result) {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not Found',
      });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router
