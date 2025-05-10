import e from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
// import PdfParse from "pdf-parse";

const app = e();
const port = 3000;
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(e.json());

// multer upload
const upload = multer({ dest: "uploads/" });

// GEMINI and Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-1.5-turbo"; // or "gemini-1.5-turbo-16k"

// middleware
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
    next();
  });
};

// handle gemini
async function main() {}

main();

app.post("/analyze-pdf", upload.single("file"), async (req, res) => {
  const prompt = req.query.prompt;
  console.log(req.file);
  const filePath = req.file.path;

  //   const dataBuffer = fs.readFileSync(filePath);

  // use data.text
  const contents = [
    { text: prompt ? prompt : "Summarize this document" },
    {
      inlineData: {
        mimeType: "application/pdf",
        data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      },
    },
  ];

  const aiRes = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    config: conf,
  });
  res.send(aiRes);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
});

// app.get("/gemini", main, async (req, res) => {
//   res.send(req.response);
// });

app.get("/verifyJWT", verifyToken, (req, res) => {
  res.send("Verification successful");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
