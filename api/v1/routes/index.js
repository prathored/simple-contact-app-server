const express = require("express");
const router = express.Router();

require("./contacts")(router);
require("./messages")(router);

module.exports = router;
