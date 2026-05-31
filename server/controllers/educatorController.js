const express = require("express");
const { clerkClient } = require("@clerk/express");
const Course = require("../models/Course");
const { v2 } = require("cloudinary");

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

module.exports = { updateRoleToEducator };
