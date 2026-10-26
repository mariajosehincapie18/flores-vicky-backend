import express from "express";

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

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});