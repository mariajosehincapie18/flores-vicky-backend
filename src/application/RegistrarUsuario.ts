import bcrypt from "bcryptjs";
import { prisma } from "../infrastructure/database/prisma";

interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}

export async function registrarUsuario(datos: DatosRegistro) {
  const nombre = datos.nombre.trim();
  const email = datos.email.trim().toLowerCase();

  if (!nombre || !email || !datos.password) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (datos.password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  const usuarioExistente = await prisma.user.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error("El correo electrónico ya está registrado");
  }

  const passwordHash = await bcrypt.hash(datos.password, 10);

  const usuario = await prisma.user.create({
    data: {
      nombre,
      email,
      password: passwordHash,
      role: "user",
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      role: true,
    },
  });

  return usuario;
}
