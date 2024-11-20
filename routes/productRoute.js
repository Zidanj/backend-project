import express from "express";
import { addProduct, listProduct, updateProduct, removeProduct, getOneProduct } from "../controllers/productController.js";
import multer from "multer";

const productRouter = express.Router();

// image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

productRouter.post("/add", upload.single("image"), addProduct);
productRouter.get("/list", listProduct);
productRouter.get("/list/:id", getOneProduct);
productRouter.put("/update/:id", upload.single("image"), updateProduct);
productRouter.post("/remove", removeProduct);

export default productRouter;
