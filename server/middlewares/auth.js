const { clerkClient } = require("@clerk/express");

const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Unauthorized access!" });
    }

    next();
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
