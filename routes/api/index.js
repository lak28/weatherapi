const express = require("express");

const router = express.Router();
//convert received data to json
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

//path to client
router.use("/weather", require("./weather"));


module.exports = router;
