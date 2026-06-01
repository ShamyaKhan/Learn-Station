const express = require("express");
const {
  getUserData,
  userEnrolledCourses,
  purchaseCourse,
} = require("../controllers/userController");

const router = express.Router();

router.get("/data", getUserData);

router.get("/enrolled-courses", userEnrolledCourses);

router.post("/purchase", purchaseCourse);

module.exports = router;
