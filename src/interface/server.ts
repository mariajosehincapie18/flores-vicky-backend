import express from "express";
import { prisma } from "../infrastructure/database/prisma";
import { obtenerProductos } from "../application/ObtenerProductos";
import { obtenerProductoPorId } from "../application/ObtenerProductoPorId";
import { registrarUsuario } from "../application/RegistrarUsuario";
import { iniciarSesion } from "../application/IniciarSesion";


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


app.post("/api/auth/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios",
      });
      return;
    }

    const usuario = await registrarUsuario({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al registrar usuario";

    if (
      mensaje === "Todos los campos son obligatorios" ||
      mensaje === "La contraseña debe tener al menos 8 caracteres"
    ) {
      res.status(400).json({ mensaje });
      return;
    }

    if (mensaje === "El correo electrónico ya está registrado") {
      res.status(409).json({ mensaje });
      return;
    }

    console.error(error);
    res.status(500).json({ mensaje: "No se pudo registrar el usuario" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({
        mensaje: "El correo y la contraseña son obligatorios",
      });
      return;
    }

    const resultado = await iniciarSesion({ email, password });

    res.json(resultado);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al iniciar sesión";

    if (
      mensaje === "El correo y la contraseña son obligatorios" ||
      mensaje === "La configuración de autenticación no está completa"
    ) {
      res.status(400).json({ mensaje });
      return;
    }

    if (mensaje === "Credenciales incorrectas") {
      res.status(401).json({ mensaje });
      return;
    }

    console.error(error);
    res.status(500).json({ mensaje: "No se pudo iniciar sesión" });
  }
});





app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});