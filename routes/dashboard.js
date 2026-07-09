const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboard");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, dashboard.renderDashboard);

module.exports = router;
