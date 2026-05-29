const express = require("express");
const cors = require("cors");
const { PORT_NUMBER } = require("./utils/constants");
const connectDB = require("./configs/db");
const { clerkWebhooks } = require("./controllers/webhooks");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.post("/clerk", express.json(), clerkWebhooks);

const PORT = PORT_NUMBER || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};

startServer();
