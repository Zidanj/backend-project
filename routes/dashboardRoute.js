import express from "express";
import authMiddleware from "../middleware/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", authMiddleware, (req, res) => {
  const { role } = req.user;

  if (role === "admin") {
    return res.json({ success: true, message: "Welcome to Admin Dashboard", role });
  } else if (role === "customer") {
    return res.json({ success: true, message: "Welcome to Customer Dashboard", role });
  } else {
    return res.json({ success: false, message: "Invalid role" });
  }
});

export default dashboardRouter;
