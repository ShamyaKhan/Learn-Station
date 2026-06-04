const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    userId: { type: String, required: true, ref: "User" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed"],
    },
  },
  { timestamps: true },
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
