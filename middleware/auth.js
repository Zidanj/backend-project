import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not authorized Login again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;

    // role login
    // Ambil user detail dari database untuk mendapatkan role
    const user = await userModel.findById(token_decode.id);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    req.user = user; // Simpan user data untuk akses di route berikutnya
    // end role login

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default authMiddleware;
