const express = require('express');
const router = express.Router();
const joinProductRouter = require('./joinProductRouter');
const showJoinedRouter = require('./showJoinedRouter');

router.use('/joinProduct', joinProductRouter);
router.use('/showJoined', showJoinedRouter);

module.exports = router;