var express = require('express');
var router = express.Router();
var path = require('path');
var user_controller = require('../controller/userController');
var henquiry_controller = require('../controller/henquiryController');
var message_controller = require('../controller/messageController');

// GET route for henquiries page
router.get('/henquiries', henquiry_controller.henquiries_get);

// GET route for henquiries page
router.get('/henquiries_specific', henquiry_controller.henquiries_specific_get);

// POST route for henquiries page
router.post('/henquiries', henquiry_controller.henquiries_create);

// DELETE a henquiry
router.delete('/henquiries', henquiry_controller.henquiries_delete);

// POST route for applying
router.post('/apply', henquiry_controller.apply_post);

// POST route for accepting applicants
router.post('/cancel_post', henquiry_controller.cancel_post);

// POST route for accepting applicants
router.post('/confirmation', henquiry_controller.confirmation_post);

// GET index page, currently redirecting to login page
router.get('', user_controller.login_get);

// GET route for mobille register
router.get('/login', user_controller.login_get);

// POST route for logging in
router.post('/login', user_controller.login_post);

// POST route for register
router.post('/register', user_controller.register_post);

// GET route after registering
router.get('/profile', user_controller.profile_get);

// POST route for profile editing
router.post('/profile', user_controller.profile_edit_post);

// GET for logout
router.get('/logout', user_controller.logout);

// GET route for the calendar
router.get('/calendar', henquiry_controller.calendar);

// GET route for messages
router.get('/messages', message_controller.messages_get);

// POST route for messages
router.post('/messages', message_controller.messages_post);

// TEST ROUTE
router.get('/test', (req, res, next) => {
    res.json({claas: "moin"});
});
module.exports = router;