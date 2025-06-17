import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { router } from "./routes";
import { connectDB } from "./config/database";

const app = express();
const port = process.env.PORT || 4001;
dotenv.config({ path: path.join(__dirname, "..", "/.env") });

// Connect to MongoDB
connectDB().catch(console.error);

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(express.static(path.join(__dirname, "../../builder/dist")));

app.use("/api", router);

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../builder/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
