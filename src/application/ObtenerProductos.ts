
import { prisma } from "../infrastructure/database/prisma";

export async function obtenerProductos() {
  const productos = await prisma.producto.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return productos;
}
