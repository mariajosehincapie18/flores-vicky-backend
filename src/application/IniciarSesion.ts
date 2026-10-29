
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../infrastructure/database/prisma";

interface DatosInicioSesion {
  email: string;
  password: string;
}

export async function iniciarSesion(datos: DatosInicioSesion) {
  const email = datos.email.trim().toLowerCase();

  if (!email || !datos.password) {
    throw new Error("El correo y la contraseña son obligatorios");
  }

  const usuario = await prisma.user.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error("Credenciales incorrectas");
  }

  const contrasenaValida = await bcrypt.compare(
    datos.password,
    usuario.password
  );

  if (!contrasenaValida) {
    throw new Error("Credenciales incorrectas");
  }

  const secreto = process.env.JWT_SECRET;

  if (!secreto) {
    throw new Error("La configuración de autenticación no está completa");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
    },
    secreto,
    { expiresIn: "2h" }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
    },
  };
}
