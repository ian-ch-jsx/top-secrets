const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const secret = await Secret.findAll();
    res.send(secret);
  } catch (error) {
    next(error);
  }
});
