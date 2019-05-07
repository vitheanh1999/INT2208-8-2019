var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Get Sign Up
router.get('/sign-up', function(req, res, next) {
  res.render('sign_up', {title : 'Sign Up'  , script:"/javascripts/sign_up.js"});
});
// Get Pass
router.get('/repass/:id', function(req, res, next) {
  res.render('repass', {title : 'Repass'  , script :"/javascripts/repass.js"});
});
// Get Sign In
router.get('/sign-in', function(req, res, next) {
  res.render('sign_in', {title : 'Sign In'  , script :"/javascripts/sign_in.js"});
});
router.get('/verify/:id', function(req, res, next) {
  res.render('verify', {title : 'Verify'  , script :"/javascripts/verify.js"});
});
module.exports = router;
