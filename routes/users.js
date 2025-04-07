var express = require('express');
var router = express.Router();
var userSchema = require('../model/user.model')
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log("test")
 
  
});

module.exports = router;
