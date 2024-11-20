import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors(corsConfig));
app.options("", cors(corsConfig))

// DB connection
connectDB();

// api endpoints
app.use("/api/product", productRouter);
app.use("/images", express.static("uploads"));
app.use("/category/images", express.static("uploads/category"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api", dashboardRoute);
app.use("/api/category", categoryRoute);

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
