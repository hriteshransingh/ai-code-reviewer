import express from "express";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.routes.js";
import cors from "cors";
import path from "path";

const app = express();
dotenv.config();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api", aiRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res)=> {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
