const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: true },
    lectureCompleted: [],
  },
  { minimize: false },
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;
