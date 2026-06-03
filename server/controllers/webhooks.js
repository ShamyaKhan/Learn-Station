const { Webhook } = require("svix");
const {
  CLERK_WEBHOOK_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = require("../utils/constants");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const stripeWebhooks = async (req, res) => {
  console.log("reached stripe webhook controller");
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
    console.log(event.type);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const { purchaseId } = session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(
          purchaseData.courseId.toString(),
        );

        courseData.enrolledStudents.push(userData);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = "completed";
        await purchaseData.save();

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const { purchaseId } = session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        purchaseData.status = "failed";
        await purchaseData.save();
        break;
      }
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = { clerkWebhooks, stripeWebhooks };
