import express from "express";
import userRoutes from "./routes/userRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import { handleError } from "./utils/errorhandler.js";
import { appError } from "./utils/errorhandler.js";
import cors from "cors";
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
// app.get("/", (req, res) => {
//   res.json({
//     message: "Hello from express server",
//   });
// });
app.use("/api/products", ProductRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(handleError);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
