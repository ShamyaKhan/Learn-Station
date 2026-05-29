const express = require("express");
const { clerkClient } = require("@clerk/express");

const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });
    res.json({ success: true, message: "You can publish a course now!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = { updateRoleToEducator };
