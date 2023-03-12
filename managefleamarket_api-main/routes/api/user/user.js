const express = require('express');
const route = express.Router();

route.use('/user', require('./user.user'));
route.use('/login', require('./user.login'));

module.exports = route;