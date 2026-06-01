const express = require("express");
const { model } = require("mongoose");
const upload = require("../configs/multer");
const { protectEducator } = require("../middlewares/auth");
const {
  updateRoleToEducator,
  addCourse,
  getEducatorCourses,
  getEnrolledStudentsData,
  educatorDashboardData,
} = require("../controllers/educatorController");

const router = express.Router();

router.get("/update-role", updateRoleToEducator);

router.post("/add-course", upload.single("image"), protectEducator, addCourse);

router.get("/courses", protectEducator, getEducatorCourses);

router.get("/dashboard", protectEducator, educatorDashboardData);

router.get("/enrolled-students", protectEducator, getEnrolledStudentsData);

module.exports = router;
