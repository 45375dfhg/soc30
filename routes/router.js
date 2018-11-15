var express = require('express');
var router = express.Router();
var path = require('path');
var user_controller = require('../controller/userController');
var henquiry_controller = require('../controller/henquiryController');

// GET route for henquiries page
router.get('/henquiries', henquiry_controller.henquiries_get);

// POST route for henquiries page
router.post('/henquiries', henquiry_controller.henquiries_create);

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

module.exports = router;