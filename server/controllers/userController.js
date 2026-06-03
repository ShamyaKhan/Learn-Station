const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Purchase = require("../models/Purchase");
const User = require("../models/User");
const { STRIPE_SECRET_KEY, CURRENCY } = require("../utils/constants");
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data not found!" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    const currency = CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const updateUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const addUserRating = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid Details!" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course Not Found!" });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User did not purchase this course!",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId,
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    res.json({ success: true, message: "Rating Added!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = {
  getUserData,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
};
