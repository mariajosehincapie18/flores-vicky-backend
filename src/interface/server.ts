import express from "express";
import { prisma } from "../infrastructure/database/prisma";
import { obtenerProductos } from "../application/ObtenerProductos";
import { obtenerProductoPorId } from "../application/ObtenerProductoPorId";

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


app.get("/api/productos", async (_req, res) => {
  try {
    const productos = await obtenerProductos();

    res.json(productos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: "error",
      mensaje: "No se pudieron consultar los productos",
    });
  }
});


app.get("/api/productos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      mensaje: "El ID debe ser un número entero positivo",
    });
    return;
  }

  try {
    const producto = await obtenerProductoPorId(id);

    if (!producto) {
      res.status(404).json({
        mensaje: "Producto no encontrado",
      });
      return;
    }

    res.json(producto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "No se pudo consultar el producto",
    });
  }
});




app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});