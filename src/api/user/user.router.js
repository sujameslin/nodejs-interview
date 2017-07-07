const Express = require('express');
const controller = require('./user.controller.js');
const asyncWrapper = require('../../asyncWrapper.helper');
const router = Express.Router();

router.get('/', asyncWrapper(controller.getList));
router.post('/', asyncWrapper(controller.create));

module.exports = router;
