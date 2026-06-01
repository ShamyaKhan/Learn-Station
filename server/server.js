require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PORT_NUMBER } = require("./utils/constants");
const connectDB = require("./configs/db");
const { clerkWebhooks } = require("./controllers/webhooks");
const { clerkMiddleware } = require("@clerk/express");
const educatorRouter = require("./routes/educatorRoutes");
const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");
const connectCloudinary = require("./configs/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.post("/clerk", clerkWebhooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

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
