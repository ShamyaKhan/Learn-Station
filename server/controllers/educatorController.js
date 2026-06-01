const { clerkClient } = require("@clerk/express");
const Course = require("../models/Course");
const { v2 } = require("cloudinary");
const Purchase = require("../models/Purchase");
const User = require("../models/User");

const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });
    res.json({ success: true, message: "You can publish a course now!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);

    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await v2.uploader.upload(imageFile.path);

    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.json({ success: true, message: "Course Created!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );

    const enrolledStudentsdata = [];

    for (let course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl",
      );
      students.forEach((student) => {
        enrolledStudentsdata.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsdata, totalCourses },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = {
  updateRoleToEducator,
  addCourse,
  getEducatorCourses,
  educatorDashboardData,
  getEnrolledStudentsData,
};
