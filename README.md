# Flores y Detalles Vicky – Backend

## 1. Descripción del proyecto

API REST del sistema web **Flores y Detalles Vicky**, desarrollada para gestionar el catálogo de productos, usuarios, autenticación y solicitudes de los clientes.

El backend permite consultar productos, registrar usuarios, iniciar sesión y realizar operaciones protegidas según el rol de cada usuario.

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
- **Repositorio GitHub:** https://github.com/mariajosehincapie18/flores-vicky-backend
- **Frontend:** https://flores-vicky-frontend.vercel.app

## 4. Arquitectura del proyecto

El backend está organizado en cuatro capas para separar responsabilidades:

- **Domain:** contiene los modelos y conceptos principales del dominio.
- **Application:** contiene los casos de uso y la lógica de aplicación.
- **Infrastructure:** gestiona la conexión con la base de datos y el acceso mediante Prisma.
- **Interface:** contiene el servidor, las rutas y los controladores que reciben las solicitudes HTTP.

Esta separación facilita el mantenimiento y permite que cada parte del sistema tenga una responsabilidad definida.

## 5. Funcionalidades principales

- Registro de usuarios.
- Inicio de sesión mediante JWT.
- Almacenamiento seguro de contraseñas mediante bcrypt.
- Consulta del catálogo de productos.
- Consulta individual de productos.
- Creación, edición y eliminación de productos para administradores.
- Registro y consulta de interacciones de los usuarios.
- Registro de consultas generales.
- Protección de rutas según autenticación y rol.
- Persistencia de información en PostgreSQL.

## 6. Instalación y ejecución local

### Requisitos

- Node.js
- npm
- PostgreSQL

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/mariajosehincapie18/flores-vicky-backend.git
cd flores-vicky-backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="URL_DE_POSTGRESQL"
JWT_SECRET="SECRETO_JWT"
JWT_EXPIRES_IN="1d"
PORT=3000
```

4. Generar Prisma Client:

```bash
npx prisma generate
```

5. Aplicar las migraciones:

```bash
npx prisma migrate deploy
```

6. Iniciar el servidor:

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

## 7. Variables de entorno

| Variable | Descripción |
|---|---|
| DATABASE_URL | Cadena de conexión a PostgreSQL. |
| JWT_SECRET | Clave utilizada para firmar los tokens JWT. |
| JWT_EXPIRES_IN | Tiempo de expiración del token. |
| PORT | Puerto en el que se ejecuta el servidor. |

El archivo `.env` contiene información privada y no debe subirse al repositorio. Se proporciona un archivo `.env.example` como referencia para configurar el proyecto.

## 8. Credenciales de prueba

Las siguientes cuentas están disponibles en el entorno desplegado para realizar las pruebas de autenticación y autorización.

**Administrador**

- Correo: `mjhincapie18@gmail.com`
- Contraseña: `AdminVicky2026!`
- Rol: `admin`

**Usuario**

- Correo: `maria.hincapi@gmail.com`
- Contraseña: `UsuarioVicky2026!`
- Rol: `user`

Estas son cuentas de demostración creadas para la evaluación del proyecto.

## 9. Decisiones técnicas

### 9.1. Flujo de inicio de sesión

El usuario ingresa su correo y contraseña desde el formulario del frontend. Estos datos se envían al endpoint de autenticación del backend. El servidor busca el usuario por su correo y compara la contraseña ingresada con el hash almacenado mediante bcrypt.

Si las credenciales son correctas, se genera un token JWT que contiene el identificador y el rol del usuario. El frontend recibe el token y lo utiliza para acceder a las rutas protegidas.

### 9.2. Almacenamiento del token

El frontend almacena el token en `localStorage` para conservar la sesión cuando se actualiza la página. Posteriormente, lo envía en el encabezado `Authorization` de las solicitudes que requieren autenticación.

El uso de `localStorage` facilita la persistencia de la sesión, aunque presenta riesgos si existe una vulnerabilidad XSS, ya que un script malicioso podría acceder al token. Por eso, es importante validar y proteger las entradas de la aplicación.

### 9.3. Diferencia entre los errores 401 y 403

- **401 Unauthorized:** se devuelve cuando el usuario no ha iniciado sesión o presenta un token inválido o vencido.
- **403 Forbidden:** se devuelve cuando el usuario está autenticado, pero no tiene permisos para realizar una operación.

Por ejemplo, si una persona intenta eliminar un producto sin iniciar sesión, recibe un 401. Si inicia sesión como usuario normal e intenta eliminarlo, recibe un 403 porque esa operación está reservada para administradores.

### 9.4. Seguridad y relaciones de datos

Se utiliza PostgreSQL para mantener la información y Prisma para gestionar las consultas. Las contraseñas se almacenan mediante hash y las operaciones protegidas utilizan JWT.

El identificador del usuario que registra una interacción se obtiene del token de autenticación y no del cuerpo de la petición. De esta manera, se evita que un usuario intente registrar interacciones a nombre de otra persona.

### 9.5. Uso de inteligencia artificial

Se utilizó inteligencia artificial como apoyo durante el desarrollo para comprender errores, revisar código, orientar la organización del proyecto y resolver problemas de implementación.

Las sugerencias se revisaron, adaptaron y probaron en el entorno del proyecto. La integración, las decisiones finales y las pruebas se realizaron sobre el código de la aplicación.

## 10. Evidencia de autenticación

Para la evaluación se debe verificar desde las herramientas de desarrollo del navegador, en la pestaña **Network**, una solicitud protegida que incluya el encabezado:

```http
Authorization: Bearer TOKEN
```

Esta evidencia permite comprobar que el frontend env
