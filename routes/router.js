var express = require('express');
var router = express.Router();
var path = require('path');
var user_controller = require('../controller/userController');
var henquiry_controller = require('../controller/henquiryController');

// GET route for henquiries page
router.get('/henquiries', henquiry_controller.henquiries_get);

// POST route for henquiries page
router.post('/henquiries', henquiry_controller.henquiries_create);

// POST route for henquiries page
router.post('/henquiries', henquiry_controller.henquiries_create);

// GET route for mobille register
router.get('/login', user_controller.login_get);

// GET route for logging in / register
router.get('/login', user_controller.login_get);

// POST route for logging in / register
router.post('/login', user_controller.login_register_post);

// GET route after registering
router.get('/profile', user_controller.profile);

// GET for logout
router.get('/logout', user_controller.logout);

module.exports = router;
