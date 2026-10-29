
import { prisma } from "../infrastructure/database/prisma";

export async function obtenerProductoPorId(id: number) {
  const producto = await prisma.producto.findUnique({
    where: {
      id: id,
    },
  });

  return producto;
}
