var express = require('express');
var router = express.Router();
var path = require('path');
var user_controller = require('../controller/userController');
var henquiry_controller = require('../controller/henquiryController');
var message_controller = require('../controller/messageController');
var verifyToken = require('../controller/verifyToken');

// GET route for henquiries page
router.get('/henquiries', verifyToken, henquiry_controller.getHenquiries);

// GET route for henquiries page
router.get('/henquiries/specific', verifyToken, henquiry_controller.getSpecificHenquiry);

// POST route for henquiries page
router.post('/henquiries', verifyToken, henquiry_controller.createHenquiry);

// DELETE a henquiry
router.delete('/henquiries/specific', verifyToken, henquiry_controller.deleteHenquiry);

// POST route for applying
router.put('/henquiries/apply', verifyToken, henquiry_controller.apply);

// POST route for closing a henquiry
router.put('/henquiries/close', verifyToken, henquiry_controller.closeHenquiry);

// POST route for accepting applicants
router.put('/henquiries/accept', verifyToken, henquiry_controller.acceptApplicants);

// POST route when help has happened successfully
router.put('/henquiries/success', verifyToken, henquiry_controller.henquirySuccess);

// POST route for canceling an application
router.put('/henquiries/cancel', verifyToken, henquiry_controller.cancelApplication);

/*
// GET index page, currently redirecting to login page
router.get('', user_controller.login_get);

// GET route for mobille register
router.get('/login', user_controller.login_get);
*/

// POST route for logging in
router.post('/login', user_controller.login);

// POST route for register
router.post('/register', user_controller.register);

// GET route after registering
router.get('/profile', verifyToken, user_controller.getProfile);

// POST route for profile editing
router.put('/profile', verifyToken, user_controller.editProfile);

// GET for logout
router.get('/logout', verifyToken, user_controller.logout);

// GET route for the calendar
router.get('/calendar', verifyToken, henquiry_controller.calendar);

// GET route for an overview of the messages
router.get('/messages/overview', verifyToken, message_controller.messagesOverview);

// GET route for a specific chat
router.get('/messages/specific', verifyToken, message_controller.messagesSpecific);

// POST route for messages
router.post('/messages', verifyToken, message_controller.sendMessage);

// TEST ROUTE
router.get('/test', (req, res, next) => {
    res.json({claas: "moin"});
});

// TEST ROUTE Alle Hilfsgesuche mit allen Feldern laden, egal ob geschlossen
// oder bereits abgeschlossen
router.get('/test_henquiries', henquiry_controller.henquiry_test);

module.exports = router;