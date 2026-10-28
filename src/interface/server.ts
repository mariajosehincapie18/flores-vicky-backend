import express from "express";
import { prisma } from "../infrastructure/database/prisma";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    mensaje: "API de Flores y Detalles Vicky funcionando",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    estado: "ok",
  });
});
app.get("/api/test-db", async (_req, res) => {
  try {
    const cantidad = await prisma.producto.count();

    res.json({
      estado: "ok",
      productos: cantidad,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: "error",
      mensaje: "No se pudo conectar con la base de datos",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});