import express from "express";
import { prisma } from "../infrastructure/database/prisma";
import { obtenerProductos } from "../application/ObtenerProductos";
import { obtenerProductoPorId } from "../application/ObtenerProductoPorId";
import { registrarUsuario } from "../application/RegistrarUsuario";
import { iniciarSesion } from "../application/IniciarSesion";
import { crearProducto } from "../application/CrearProducto";
import { actualizarProducto } from "../application/ActualizarProducto";
import { eliminarProducto } from "../application/EliminarProducto";
import { autenticarToken, soloAdmin } from "./middlewares/autenticacion";
import { Prisma } from "../infrastructure/database/generated/prisma/client";
import cors from "cors";



const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      ...(process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL]
        : []),
    ],
  })
);

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
app.post("/api/productos", autenticarToken, soloAdmin, async (req, res) => {
  try {
    const { nombre, categoria, imagen, descripcion, caracteristicas } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof categoria !== "string" ||
      typeof imagen !== "string" ||
      typeof descripcion !== "string" ||
      typeof caracteristicas !== "string" ||
      !nombre.trim() ||
      !categoria.trim()
    ) {
      res.status(400).json({
        mensaje: "Todos los campos del producto son obligatorios",
      });
      return;
    }

    const producto = await crearProducto({
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      imagen: imagen.trim(),
      descripcion: descripcion.trim(),
      caracteristicas: caracteristicas.trim(),
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "No se pudo crear el producto",
    });
  }
});

app.put("/api/productos/:id", autenticarToken, soloAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      mensaje: "El ID debe ser un número entero positivo",
    });
    return;
  }

  try {
    const { nombre, categoria, imagen, descripcion, caracteristicas } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof categoria !== "string" ||
      typeof imagen !== "string" ||
      typeof descripcion !== "string" ||
      typeof caracteristicas !== "string" ||
      !nombre.trim() ||
      !categoria.trim()
    ) {
      res.status(400).json({
        mensaje: "Todos los campos del producto son obligatorios",
      });
      return;
    }

    const producto = await actualizarProducto(id, {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      imagen: imagen.trim(),
      descripcion: descripcion.trim(),
      caracteristicas: caracteristicas.trim(),
    });

    res.json({
      mensaje: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        mensaje: "Producto no encontrado",
      });
      return;
    }

    res.status(500).json({
      mensaje: "No se pudo actualizar el producto",
    });
  }
});


app.delete("/api/productos/:id", autenticarToken, soloAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      mensaje: "El ID debe ser un número entero positivo",
    });
    return;
  }

  try {
    await eliminarProducto(id);

    res.json({
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        mensaje: "Producto no encontrado",
      });
      return;
    }

    res.status(500).json({
      mensaje: "No se pudo eliminar el producto",
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

// Crear solicitud de encargo
app.post("/api/interacciones", autenticarToken, async (req, res) => {
  try {
    const { productoId, mensaje } = req.body;

    if (
      !Number.isInteger(productoId) ||
      productoId <= 0 ||
      typeof mensaje !== "string" ||
      !mensaje.trim()
    ) {
      res.status(400).json({
        mensaje: "El producto y el mensaje son obligatorios",
      });
      return;
    }

    if (!req.usuario) {
  res.status(401).json({
    mensaje: "Debes iniciar sesión para enviar una solicitud",
  });
  return;
}

const usuarioId = Number(req.usuario.id);

    const interaccion = await prisma.interaccion.create({
      data: {
        userId: usuarioId,
        productoId,
        mensaje: mensaje.trim(),
      },
    });

    res.status(201).json({
      mensaje: "Solicitud enviada correctamente",
      interaccion,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "No se pudo enviar la solicitud",
    });
  }
});

// Crear consulta general
app.post("/api/consultas", autenticarToken, async (req, res) => {
  try {
    const { mensaje } = req.body;

    if (typeof mensaje !== "string" || !mensaje.trim()) {
      res.status(400).json({
        mensaje: "El mensaje es obligatorio",
      });
      return;
    }

    if (!req.usuario) {
      res.status(401).json({
        mensaje: "Debes iniciar sesión para enviar una consulta",
      });
      return;
    }

    const usuarioId = Number(req.usuario.id);

    const consulta = await prisma.consulta.create({
      data: {
        userId: usuarioId,
        mensaje: mensaje.trim(),
      },
    });

    res.status(201).json({
      mensaje: "Tu consulta fue enviada con éxito",
      consulta,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "No se pudo enviar la consulta",
    });
  }
});

// Consultar solicitudes del usuario autenticado
app.get("/api/interacciones/mis-interacciones", autenticarToken, async (req, res) => {
  try {
    if (!req.usuario) {
      res.status(401).json({
        mensaje: "Debes iniciar sesión",
      });
      return;
    }

    const usuarioId = Number(req.usuario.id);

    const interacciones = await prisma.interaccion.findMany({
      where: {
        userId: usuarioId,
      },
      include: {
        producto: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(interacciones);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "No se pudieron consultar tus solicitudes",
    });
  }
});





app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});