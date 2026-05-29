require("dotenv").config();

const PORT_NUMBER = Number(process.env.PORT_NUMBER);
const MONGODB_URI = process.env.MONGODB_URI;
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

module.exports = { PORT_NUMBER, MONGODB_URI, CLERK_WEBHOOK_SECRET };
