import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Iniciando seed...");

const producto = await prisma.producto.create({
  data: {
    nombre: "Producto de prueba",
    categoria: "Prueba",
    imagen: "prueba.jpg",
    descripcion: "Producto utilizado para probar el seed.",
    caracteristicas: "Prueba de conexión con PostgreSQL"
  }
});

console.log("Producto creado:", producto);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });