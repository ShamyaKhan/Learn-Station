const express = require("express");
const {
  getAllCourses,
  getCourseById,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/all", getAllCourses);

router.get("/:id", getCourseById);

module.exports = router;
