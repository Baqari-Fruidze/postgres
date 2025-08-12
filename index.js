import express from "express";
import userRoutes from "./routes/userRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";

const app = express();
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
