import e from "express";
import cors from "cors";
import "dotenv/config";
import demo from "./routes/sampleRoute.js";
import generalChat from "./routes/generalAIChat.js";
import verifyToken from "./routes/middlewares/verifyJWT.js";
import analyzePDF from "./routes/analyzePDF.js";
import rateLimit from "express-rate-limit";

const app = e();
const port = process.env.PORT || 3000;

// request limit handler
const reqLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Your request limit is over",
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(e.json());

// use request limiter
app.use(reqLimit);

// middle ware to use routes: all the api routs
app.use("/api", demo);
app.use("/api", generalChat);
app.use("/api", analyzePDF);

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
