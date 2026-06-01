const { Webhook } = require("svix");
const {
  CLERK_WEBHOOK_SECRET,
  STRIPE_SECRET_KEY,
} = require("../utils/constants");
const User = require("../models/User");
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
  try {
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = { clerkWebhooks };
