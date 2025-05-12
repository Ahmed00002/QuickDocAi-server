import jwt from "jsonwebtoken";

// middleware for verifying the jwt token
const verifyToken = (req, res, next) => {
  //   console.log(req);
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(401).send("Invalid Token");
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
