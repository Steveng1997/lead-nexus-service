import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import leadRoutes from "./routes/lead.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LeadNexus API corriendo en http://localhost:${PORT}`);
});
