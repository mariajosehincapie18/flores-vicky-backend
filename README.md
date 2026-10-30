# Flores y Detalles Vicky – Backend

## 1. Descripción del proyecto

Flores y Detalles Vicky es una aplicación web desarrollada para presentar y gestionar el catálogo de productos de una floristería. Este repositorio contiene el backend del sistema, implementado como una API REST que permite administrar productos, usuarios, autenticación y solicitudes de los clientes.

El backend se encarga de gestionar la información, validar las solicitudes, controlar los permisos de acceso y mantener la persistencia de los datos en una base de datos PostgreSQL.

## 2. Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JSON Web Token (JWT)
- bcryptjs

## 3. Enlaces del proyecto

- **API desplegada:** https://flores-vicky-backend.onrender.com
- **Repositorio del backend:** https://github.com/mariajosehincapie18/flores-vicky-backend
- **Repositorio del frontend:** https://github.com/mariajosehincapie18/flores-vicky-frontend
- **Aplicación web:** https://flores-vicky-frontend.vercel.app

## 4. Arquitectura del proyecto

El backend está organizado en cuatro capas, con el propósito de separar las responsabilidades y facilitar el mantenimiento del código.

- **Domain:** contiene los modelos y conceptos principales del dominio.
- **Application:** contiene los casos de uso y la lógica de aplicación.
- **Infrastructure:** gestiona la conexión con la base de datos y el acceso a los datos mediante Prisma.
- **Interface:** contiene el servidor, las rutas y los controladores que reciben las solicitudes HTTP.

Esta organización permite mantener una separación entre la lógica del negocio, el acceso a los datos y la comunicación con el cliente.

## 5. Funcionalidades principales

- Registro de nuevos usuarios.
- Inicio de sesión mediante autenticación JWT.
- Almacenamiento seguro de contraseñas mediante bcrypt.
- Consulta del catálogo de productos.
- Consulta individual de productos.
- Creación, edición y eliminación de productos para administradores.
- Registro de interacciones de los usuarios con los productos.
- Consulta de las interacciones propias de cada usuario.
- Registro de consultas generales.
- Protección de rutas según autenticación y rol.
- Persistencia de información en PostgreSQL.

## 6. Base de datos

La aplicación utiliza PostgreSQL como sistema de gestión de base de datos y Prisma ORM para realizar las operaciones.

Se manejan principalmente las siguientes entidades:

- **User:** almacena los datos de los usuarios, correo electrónico, contraseña cifrada y rol.
- **Producto:** almacena la información del catálogo de la floristería.
- **Interaccion:** registra las interacciones realizadas por los usuarios con los productos.
- **Consulta:** almacena las consultas generales realizadas por los clientes.

Las relaciones entre usuarios, productos e interacciones permiten mantener la asociación entre cada operación y el usuario que la realiza.

### Datos iniciales

El archivo `prisma/seed.ts` contiene los 24 productos iniciales del catálogo.

Los usuarios de prueba utilizados para la evaluación se encuentran configurados en la base de datos desplegada.

## 7. Instalación y ejecución local

### Requisitos previos

- Node.js
- npm
- PostgreSQL

### Pasos de instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/mariajosehincapie18/flores-vicky-backend.git
cd flores-vicky-backend
```

**2. Instalar las dependencias**

```bash
npm install
```

**3. Configurar las variables de entorno**

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
DATABASE_URL="URL_DE_POSTGRESQL"
JWT_SECRET="SECRETO_JWT"
JWT_EXPIRES_IN="2h"
PORT=3000
FRONTEND_URL="http://localhost:3000"
```

Los valores deben corresponder a la configuración de la base de datos y del entorno donde se ejecuta la aplicación.

**4. Generar Prisma Client**

```bash
npx prisma generate
```

**5. Aplicar las migraciones**

```bash
npx prisma migrate deploy
```

**6. Cargar los productos iniciales**

```bash
npx prisma db seed
```

Este comando carga los 24 productos definidos en `prisma/seed.ts`. No debe ejecutarse repetidamente sobre una base de datos que ya contiene esos productos, porque el seed actual utiliza `createMany` y puede generar registros duplicados.

**7. Iniciar el servidor**

```bash
npm run dev
```

La API estará disponible localmente en:

`http://localhost:3000`

## 8. Variables de entorno

| Variable | Descripción |
|---|---|
| DATABASE_URL | Cadena de conexión a PostgreSQL. |
| JWT_SECRET | Clave utilizada para firmar los tokens JWT. |
| JWT_EXPIRES_IN | Tiempo de expiración del token. |
| PORT | Puerto en el que se ejecuta el servidor. |
| FRONTEND_URL | Dirección del frontend autorizado para realizar solicitudes. |

El archivo `.env` contiene información privada y no debe subirse al repositorio. El archivo `.env.example` proporciona una plantilla para configurar el proyecto.

## 9. Credenciales de prueba

Las siguientes cuentas permiten comprobar los permisos y funcionalidades del sistema desplegado.

### Administrador

- **Correo:** `mjhincapie18@gmail.com`
- **Contraseña:** `AdminVicky2026!`
- **Rol:** `admin`

### Usuario normal

- **Correo:** `maria.hincapi@gmail.com`
- **Contraseña:** `UsuarioVicky2026!`
- **Rol:** `user`

Estas cuentas son exclusivamente para la evaluación del proyecto. No deben utilizarse para información personal ni reutilizarse en otros servicios.

## 10. Decisiones técnicas

### 10.1. Flujo de inicio de sesión

El usuario ingresa su correo electrónico y contraseña desde el formulario de inicio de sesión del frontend. Estos datos se envían al endpoint de autenticación del backend.

El servidor busca al usuario mediante su correo y compara la contraseña ingresada con el hash almacenado utilizando bcrypt.

Si las credenciales son correctas, se genera un token JWT que contiene el identificador y el rol del usuario. El frontend recibe el token y lo utiliza para acceder a las rutas protegidas.

### 10.2. Almacenamiento del token

El frontend almacena el token en `localStorage` para conservar la sesión cuando se actualiza la página.

Posteriormente, el token se envía al backend mediante el encabezado:

```http
Authorization: Bearer TOKEN
```

Esta alternativa permite mantener la sesión de manera sencilla, aunque presenta riesgos si existe una vulnerabilidad XSS, ya que un script malicioso podría acceder al token almacenado. Por esta razón, es importante validar las entradas y proteger la aplicación.

### 10.3. Diferencia entre los errores 401 y 403

El código HTTP **401 Unauthorized** indica que el usuario no está autenticado o que el token enviado es inválido o ha expirado.

El código HTTP **403 Forbidden** indica que el usuario sí está autenticado, pero no tiene los permisos necesarios para realizar una operación.

Por ejemplo, si una persona intenta eliminar un producto sin iniciar sesión, recibe un error 401. Si inicia sesión como usuario normal e intenta eliminarlo, recibe un error 403 porque esta operación está reservada para los administradores.

### 10.4. Seguridad y relaciones de datos

Se utiliza PostgreSQL para almacenar la información y Prisma para gestionar las operaciones sobre la base de datos.

Las contraseñas se almacenan mediante hash utilizando bcrypt. Además, las rutas protegidas utilizan JWT para verificar la identidad y los permisos del usuario.

El identificador del usuario que registra una interacción se obtiene del token de autenticación y no del cuerpo de la petición. Esto evita que un usuario intente registrar interacciones a nombre de otra persona.

### 10.5. Uso de inteligencia artificial

Se utilizó inteligencia artificial como herramienta de apoyo durante el desarrollo del proyecto, principalmente para comprender errores, revisar código, orientar la organización de la arquitectura y resolver dificultades de implementación.

Las sugerencias fueron revisadas, adaptadas y probadas en el entorno del proyecto. Las decisiones finales y la integración de las funcionalidades se realizaron sobre el código de la aplicación.

## 11. Evidencia de autenticación

Para comprobar el funcionamiento de la autenticación, se puede utilizar la herramienta de desarrollo del navegador, en la pestaña **Network**.

Al realizar una solicitud protegida, se debe verificar que en los encabezados de la petición aparezca:

```http
Authorization: Bearer TOKEN
```

Esta evidencia permite comprobar que el frontend envía el token JWT al backend para acceder a las operaciones que requieren autenticación.