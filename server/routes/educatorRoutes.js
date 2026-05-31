const express = require("express");
const { model } = require("mongoose");
const { updateRoleToEducator } = require("../controllers/educatorController");

const router = express.Router();

router.get("/update-role", updateRoleToEducator);

module.exports = router;
