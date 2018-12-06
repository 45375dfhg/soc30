var express = require('express');
var router = express.Router();
var path = require('path');
var user_controller = require('../controller/userController');
var category_controller = require('../controller/categoryController');
var henquiry_controller = require('../controller/henquiryController');
var message_controller = require('../controller/messageController');
var verifyToken = require('../controller/verifyToken');
const {check,validationResult} = require('express-validator/check');
// GET route for henquiries page
router.get('/henquiries', verifyToken, henquiry_controller.getHenquiries);

// GET route for henquiries page
router.get('/henquiries/specific', verifyToken, henquiry_controller.getSpecificHenquiry);

// POST route for henquiries page
router.post('/henquiries', verifyToken, henquiry_controller.createHenquiry);

// DELETE a henquiry
router.delete('/henquiries/specific', verifyToken, henquiry_controller.deleteHenquiry);

// PUT route for applying
router.put('/henquiries/apply', verifyToken, henquiry_controller.apply);

// PUT route for closing a henquiry
router.put('/henquiries/close', verifyToken, henquiry_controller.closeHenquiry);

// PUT route for accepting applicants
router.put('/henquiries/accept', verifyToken, henquiry_controller.acceptApplicants);

// PUT route when help has happened successfully
router.put('/henquiries/success', verifyToken, henquiry_controller.henquirySuccess);

// PUT route for canceling an application
router.put('/henquiries/cancel', verifyToken, henquiry_controller.cancelApplication);

// POST route for rating an aide
router.post('/henquiries/rate', verifyToken, henquiry_controller.rate)

// POST route for rating the filer
router.post('/henquiries/ratefiler', verifyToken, henquiry_controller.rateFiler)

/*
// GET index page, currently redirecting to login page
router.get('', user_controller.login_get);

// GET route for mobille register
router.get('/login', user_controller.login_get);
*/

// POST route for logging in
router.post('/login', user_controller.login);

// POST route for register
//router.post('/register', user_controller.validate('register'), user_controller.register);
router.post('/register', user_controller.register);

// GET route after registering
router.get('/profile', verifyToken, user_controller.getProfile);

// PUT route for profile editing
router.put('/profile/specific', verifyToken, user_controller.editProfile);

// PUT route for Freunde werben
router.put('/profile/verify', verifyToken, user_controller.verifyProfile);

// DELETE route for deleting a specific profile
router.delete('/profile/specific', verifyToken, user_controller.deleteProfile)

// GET for logout
router.get('/logout', verifyToken, user_controller.logout);

// GET route for the calendar
router.get('/calendar', verifyToken, henquiry_controller.calendar);

// GET route for an overview of the messages
router.get('/messages/overview', verifyToken, message_controller.messagesOverview);

// GET route for a specific chat
router.get('/messages/specific', verifyToken, message_controller.messagesSpecific);

// POST route for messages
router.post('/messages/specific', verifyToken, message_controller.sendMessage);

// POST route for populating category collection
// Only available for a specific user (so that nobody else can do something there...)
router.post('/categories', verifyToken, category_controller.populateCategoryCollection);

// TEST ROUTE
router.get('/test', verifyToken, user_controller.test);

module.exports = router;