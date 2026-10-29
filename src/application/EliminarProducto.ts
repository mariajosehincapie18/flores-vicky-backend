
import { prisma } from "../infrastructure/database/prisma";

export async function eliminarProducto(id: number) {
  const producto = await prisma.producto.delete({
    where: {
      id: id,
    },
  });

  return producto;
}
