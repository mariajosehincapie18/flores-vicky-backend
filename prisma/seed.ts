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

  const productos = [
    {
      nombre: "Ramo en base de margaritas de colores",
      categoria: "Ramos y arreglos florales",
      imagen: "imagenes/ramo_grande.jpg",
      descripcion:
        "Un hermoso arreglo floral elaborado con margaritas de diferentes colores, ideal para sorprender y celebrar momentos especiales.",
      caracteristicas:
        "Margaritas de diferentes colores | Elaborado de manera artesanal | Ideal para regalar",
    },
    {
      nombre: "Ramo Grande Funebre",
      categoria: "Ramos y arreglos florales",
      imagen: "imagenes/ramo_grande_m.jpg",
      descripcion:
        "Ramo floral de gran tamaño, elaborado como un detalle especial para acompañar momentos de despedida.",
      caracteristicas:
        "Ramo de gran tamaño | Diseño floral | Elaborado de manera artesanal",
    },
    {
      nombre: "Cilindro con Flores",
      categoria: "Ramos y arreglos florales",
      imagen: "imagenes/florero_rosas.jpg",
      descripcion:
        "Arreglo floral presentado en un cilindro, una opción especial para regalar y decorar diferentes espacios.",
      caracteristicas:
        "Flores de diferentes colores | Presentación en cilindro | Ideal para regalar",
    },
    {
      nombre: "Cilindro con Flores y Decoración",
      categoria: "Ramos y arreglos florales",
      imagen: "imagenes/florero_rosas_mariposas.jpg",
      descripcion:
        "Arreglo floral presentado en un cilindro y acompañado de elementos decorativos que hacen de este un detalle especial.",
      caracteristicas:
        "Flores frescas | Presentación en cilindro | Detalles decorativos",
    },
    {
      nombre: "Ramo en Base con Frutas",
      categoria: "Ramos y arreglos florales",
      imagen: "imagenes/ramo_jarron.jpeg",
      descripcion:
        "Un detalle especial que combina un arreglo floral con frutas en una presentación decorativa.",
      caracteristicas:
        "Arreglo floral | Incluye frutas | Presentación especial para regalo",
    },
    {
      nombre: "Arreglo de Rosas",
      categoria: "Ramos y arreglos florales",
      imagen: "imagenes/rosas_corazon.jpeg",
      descripcion:
        "Arreglo elaborado con rosas, ideal para expresar sentimientos y sorprender en una ocasión especial.",
      caracteristicas: "Rosas | Diseño floral | Ideal para regalar",
    },
    {
      nombre: "Ancheta de Frutas",
      categoria: "Anchetas",
      imagen: "imagenes/anceta_frutas.jpg",
      descripcion:
        "Ancheta preparada con frutas seleccionadas y presentada de manera especial para sorprender con un detalle fresco y delicioso.",
      caracteristicas:
        "Frutas seleccionadas | Presentación especial | Ideal para regalar",
    },
    {
      nombre: "Ancheta con Girasoles",
      categoria: "Anchetas",
      imagen: "imagenes/ancheta_girasoles.jpeg",
      descripcion:
        "Una alegre ancheta que combina girasoles con diferentes detalles para crear un regalo especial y lleno de color.",
      caracteristicas:
        "Girasoles | Detalles decorativos | Ideal para sorprender",
    },
    {
      nombre: "Ancheta con Globos",
      categoria: "Anchetas",
      imagen: "imagenes/ancheta_globos_.jpeg",
      descripcion:
        "Una ancheta acompañada de globos y detalles especiales, perfecta para celebrar cumpleaños y ocasiones especiales.",
      caracteristicas:
        "Globos decorativos | Detalles para celebrar | Presentación especial",
    },
    {
      nombre: "Ancheta con Rosas",
      categoria: "Anchetas",
      imagen: "imagenes/ancheta_rosas_r.jpg",
      descripcion:
        "Una ancheta especial que combina rosas y diferentes detalles para crear un regalo lleno de color y cariño.",
      caracteristicas:
        "Rosas | Detalles especiales | Ideal para regalar",
    },
    {
      nombre: "Ancheta Feliz Día",
      categoria: "Anchetas",
      imagen: "imagenes/ancheta_feliz_dia.jpeg",
      descripcion:
        "Un detalle preparado para celebrar y expresar buenos deseos en un día especial.",
      caracteristicas:
        "Presentación para celebrar | Detalles especiales | Ideal para sorprender",
    },
    {
      nombre: "Ancheta Día de la Madre",
      categoria: "Anchetas",
      imagen: "imagenes/ancheta_mama.jpeg",
      descripcion:
        "Un detalle especial pensado para celebrar y homenajear a mamá en una fecha tan importante.",
      caracteristicas:
        "Diseño especial para mamá | Presentación para regalo | Ideal para celebrar el Día de la Madre",
    },
    {
      nombre: "Decoración Primera Comunión",
      categoria: "Decoraciones",
      imagen: "imagenes/d_primera_comunion.jpg",
      descripcion:
        "Decoración especial para celebrar una Primera Comunión, preparada para crear un ambiente bonito y significativo.",
      caracteristicas:
        "Decoración temática | Diseño para celebración | Montaje para eventos",
    },
    {
      nombre: "Decoración Quince Años",
      categoria: "Decoraciones",
      imagen: "imagenes/decoracion_15.jpg",
      descripcion:
        "Decoración pensada para celebrar los quince años y crear un ambiente especial para este momento tan importante.",
      caracteristicas:
        "Decoración temática | Diseño para quince años | Montaje para celebración",
    },
    {
      nombre: "Decoración de Cumpleaños Bluey",
      categoria: "Decoraciones",
      imagen: "imagenes/decoracion_bluey.jpg",
      descripcion:
        "Decoración temática de Bluey para celebrar un cumpleaños de una manera divertida y especial.",
      caracteristicas:
        "Temática de Bluey | Decoración para cumpleaños | Diseño personalizado",
    },
    {
      nombre: "Decoración de Cumpleaños Mario Bros",
      categoria: "Decoraciones",
      imagen: "imagenes/decoracion_mario.jpg",
      descripcion:
        "Decoración temática de Mario Bros para crear un ambiente divertido y especial durante la celebración.",
      caracteristicas:
        "Temática de Mario Bros | Decoración para cumpleaños | Diseño temático",
    },
    {
      nombre: "Decoración de Mesas Completas",
      categoria: "Decoraciones",
      imagen: "imagenes/decoracion_mesas.jpg",
      descripcion:
        "Decoración de mesas preparada para complementar la ambientación de diferentes tipos de celebraciones.",
      caracteristicas:
        "Decoración de mesas | Ambientación para eventos | Presentación especial",
    },
    {
      nombre: "Arco de Bombas",
      categoria: "Decoraciones",
      imagen: "imagenes/arco_bombas.jpg",
      descripcion:
        "Arco decorativo con bombas para complementar la ambientación de cumpleaños y diferentes celebraciones.",
      caracteristicas:
        "Arco de bombas | Decoración para eventos | Diseño adaptable a la celebración",
    },
    {
      nombre: "Arco de Primera Comunión",
      categoria: "Decoraciones",
      imagen: "imagenes/arco_primera_comunion.jpg",
      descripcion:
        "Arco decorativo diseñado para complementar la celebración de una Primera Comunión.",
      caracteristicas:
        "Decoración temática | Arco de bombas | Ideal para Primera Comunión",
    },
    {
      nombre: "Arreglo Matrimonio",
      categoria: "Decoraciones",
      imagen: "imagenes/arrglo_matri.jpg",
      descripcion:
        "Decoración especial para matrimonios, pensada para crear un ambiente elegante y memorable.",
      caracteristicas:
        "Decoración para matrimonio | Ambientación especial | Diseño para celebraciones",
    },
    {
      nombre: "Baby Shower",
      categoria: "Decoraciones",
      imagen: "imagenes/baby_shower.jpeg",
      descripcion:
        "Decoración temática para celebrar la llegada de un nuevo bebé y compartir este momento especial con familiares y amigos.",
      caracteristicas:
        "Decoración temática | Ambientación para Baby Shower | Diseño para celebración",
    },
    {
      nombre: "Cena Especial",
      categoria: "Catering y comidas",
      imagen: "imagenes/cena_especial.jpeg",
      descripcion:
        "Una cena especial preparada para compartir y disfrutar de un momento agradable en compañía.",
      caracteristicas:
        "Presentación especial | Ideal para ocasiones especiales | Preparada para compartir",
    },
    {
      nombre: "Tabla de Frutas",
      categoria: "Catering y comidas",
      imagen: "imagenes/tabla_frutas.jpg",
      descripcion:
        "Una selección de frutas presentada de manera especial, ideal para compartir en celebraciones y reuniones.",
      caracteristicas:
        "Variedad de frutas | Presentación especial | Ideal para compartir",
    },
    {
      nombre: "Cena",
      categoria: "Catering y comidas",
      imagen: "imagenes/cena_pollo.jpeg",
      descripcion:
        "Una opción de comida preparada para disfrutar y compartir en ocasiones especiales.",
      caracteristicas:
        "Presentación especial | Ideal para compartir | Opción para celebraciones",
    },
  ];

  await prisma.producto.createMany({
    data: productos,
  });

  console.log(`${productos.length} productos creados correctamente.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });