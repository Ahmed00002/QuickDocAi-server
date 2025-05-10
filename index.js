import e from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = e();
const port = 3000;
app.use(cors(["http://localhost:5173"]));
app.use(e.json());

const verifyToken = (req, res, next) => {
  //   console.log(req);
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  if (!token) {
    return res.send("A token is required for authentication");
  }

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    req.user = user;
  });
  next();
};

app.get("/verifyJWT", verifyToken, (req, res) => {
  res.send("Verification successful");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
