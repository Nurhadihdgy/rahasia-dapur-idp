require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const tipsRoutes = require("./routes/tipsRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorMiddlewares");
const cookieParser = require("cookie-parser");

const app = express();

connectDB();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"]
}));


app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/tips", tipsRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);



app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
