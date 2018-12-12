var express = require('express');
var router = express.Router();
var user_controller = require('../controller/userController');
//var category_controller = require('../controller/categoryController');
var henquiry_controller = require('../controller/henquiryController');
var message_controller = require('../controller/messageController');
var verifyToken = require('../controller/verifyToken');

// GET route for henquiries page
router.get('/henquiries', verifyToken, henquiry_controller.getHenquiries);

// PUT route for henquiries page (Semantisch gesehen ein GET, es wird nur etwas geladen, nichts geupdated!)
// Problem ist, dass das FE leider keine GET-Parameter übermitteln konnte
router.put('/henquiries/specific', verifyToken, henquiry_controller.getSpecificHenquiry);

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

// PUT route when help has not happened successfully
router.put('/henquiries/nosuccess', verifyToken, henquiry_controller.henquiryNoSuccess);

// PUT route for canceling an application
router.put('/henquiries/cancel', verifyToken, henquiry_controller.cancelApplication);

// POST route for rating an aide
router.post('/henquiries/rate', verifyToken, henquiry_controller.rate)

// POST route for rating the filer
router.post('/henquiries/ratefiler', verifyToken, henquiry_controller.rateFiler)

// POST route for logging in
router.post('/login', user_controller.login);

// POST route for register
router.post('/register', user_controller.register);

// PUT route for profile (von der Semantik her ein GET tatsächlich)
router.put('/profile', verifyToken, user_controller.getProfile);

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

// PUT route for a specific chat (es wird nur was geladen, d.h. von der Semantik her ein GET!)
router.put('/messages/specific', verifyToken, message_controller.messagesSpecific);

// POST route for messages
router.post('/messages/specific', verifyToken, message_controller.sendMessage);

// POST route for populating category collection
// Only available for a specific user (so that nobody else can do something there...)
//router.post('/categories', verifyToken, category_controller.populateCategoryCollection);

module.exports = router;