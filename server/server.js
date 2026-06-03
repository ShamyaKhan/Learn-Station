require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PORT_NUMBER } = require("./utils/constants");
const connectDB = require("./configs/db");
const { clerkWebhooks, stripeWebhooks } = require("./controllers/webhooks");
const { clerkMiddleware } = require("@clerk/express");
const educatorRouter = require("./routes/educatorRoutes");
const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");
const connectCloudinary = require("./configs/cloudinary");

const app = express();

app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

const PORT = PORT_NUMBER || 4000;

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};

startServer();
