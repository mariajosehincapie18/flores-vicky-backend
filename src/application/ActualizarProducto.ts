
import { prisma } from "../infrastructure/database/prisma";
import { Producto } from "../domain/Producto";

type DatosProducto = Omit<Producto, "id">;

export async function actualizarProducto(
  id: number,
  datos: DatosProducto
) {
  const producto = await prisma.producto.update({
    where: {
      id: id,
    },
    data: {
      nombre: datos.nombre,
      categoria: datos.categoria,
      imagen: datos.imagen,
      descripcion: datos.descripcion,
      caracteristicas: datos.caracteristicas,
    },
  });

  return producto;
}
