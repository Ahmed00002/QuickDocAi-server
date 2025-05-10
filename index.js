import e from "express";
import cors from "cors";

const app = e();
const port = 3000;
app.use(cors());
app.use(e.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
