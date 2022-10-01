const express = require("express");

const router = express.Router();
const postsApi = require("../../../controller/clientController");
router.use(express.json());
router.use(express.urlencoded({ extended: false }));



router.post("/create", function (req, res) {
  console.log("router req", req.body);
  postsApi.createName(req, res);
});


//route to Authenticate sceret key for jwt creation
router.get("/current/:name", function (req, res) {
  console.log("router req", req.body);
  postsApi.currentWeather(req, res);
});


router.get("/forecast/:name", function (req, res) {
  console.log("router req", req.body);
  postsApi.forecastWeather(req, res);
});

module.exports = router;
