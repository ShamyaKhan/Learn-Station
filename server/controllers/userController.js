const Course = require("../models/Course");
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

module.exports = { getUserData, userEnrolledCourses, purchaseCourse };
