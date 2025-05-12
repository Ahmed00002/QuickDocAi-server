import e from "express";
const demo = e.Router();

demo.get("/demo", (req, res) => {
  res.send("working");
});

export default demo;
