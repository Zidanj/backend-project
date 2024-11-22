import express from "express";
import { addCategory, listCategory, updateCategory, removeCategory, getOneCategory } from "../controllers/categoryController.js";
import multer from "multer";

const categoryRouter = express.Router();

// image storage engine
const storage = multer.diskStorage({
  destination: "/tmp/uploads/category",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

categoryRouter.post("/add", upload.single("image"), addCategory);
categoryRouter.get("/list", listCategory);
categoryRouter.get("/list/:id", getOneCategory);
categoryRouter.put("/update/:id", upload.single("image"), updateCategory);
categoryRouter.post("/remove", removeCategory);

export default categoryRouter;
