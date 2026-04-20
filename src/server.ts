import "dotenv/config";

import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LeadNexus API corriendo en http://localhost:${PORT}`);
});
