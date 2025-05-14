import e from "express";
import ai from "./initializeAi.js";
import multer from "multer";
import fs from "fs";
import verifyToken from "./middlewares/verifyJWT.js";

const analyzePDF = e.Router();

// saving file to upload folder with multer
// const upload = multer({ dest: "./uploads/" });
const upload = multer({ storage: multer.memoryStorage() });

// api for analyzing pdf
analyzePDF.post(
  "/analyze-pdf",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    const prompt = req.query.prompt;
    console.log(prompt);
    // getting the file path
    const filePath = req.file.path;
    const fileBuffer = req.file.buffer;
    const base64File = fileBuffer.toString("base64");
    try {
      console.log(filePath);

      // use data.text
      const contents = [
        { text: prompt ? prompt : "Summarize this document" },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64File,
          },
        },
      ];

      // generate content by reading file
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });

      res.send(response.text);
      console.log(response.text);
    } catch (error) {
      res.status(500).send("Internal server error!");
    }

    // Deleting file after analyzing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }
);

export default analyzePDF;
