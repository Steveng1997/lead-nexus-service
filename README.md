# 🚀 LeadNexus API

API RESTful diseñada para la gestión eficiente de prospectos (leads), incluyendo funcionalidades de paginación, filtrado, eliminación lógica (soft delete) e integración con servicios de Inteligencia Artificial para el análisis de datos.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js & Express:** Framework para la construcción del servidor.
* **TypeScript:** Para un código tipado, seguro y escalable.
* **Prisma ORM:** ORM moderno para la gestión de base de datos PostgreSQL.
* **PostgreSQL:** Base de datos relacional robusta.
* **Dotenv:** Para la gestión de variables de entorno.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [PostgreSQL](https://www.postgresql.org/)
* [NPM](https://www.npmjs.com/)

---

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone <tu-url-de-repositorio>
    cd lead-nexus-service
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz con la siguiente estructura:
    ```env
    DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
    PORT=3000
    ```

4.  **Sincronizar base de datos:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```

---

## 🧪 Pruebas (Postman)

Se incluye el archivo `postman_collection.json` en la raíz del proyecto para facilitar las pruebas.

### Flujo de pruebas recomendado:
1.  **POST `/api/leads`**: Registrar un nuevo lead (valida el correo único).
2.  **GET `/api/leads`**: Listar leads con filtros (`?fuente=instagram`).
3.  **GET `/api/leads/stats`**: Consultar estadísticas de conversión.
4.  **POST `/api/leads/ai/summary`**: Generar análisis inteligente de los prospectos.
5.  **PATCH / DELETE `/api/leads/:id`**: Actualizar o realizar eliminación lógica (soft delete).

---

## 📑 Endpoints Principales

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/leads` | Crear lead |
| `GET` | `/api/leads` | Listar leads (con paginación) |
| `GET` | `/api/leads/:id` | Detalle de un lead |
| `PATCH` | `/api/leads/:id` | Actualizar lead |
| `DELETE` | `/api/leads/:id` | Eliminación lógica (soft delete) |
| `GET` | `/api/leads/stats` | Estadísticas globales |
| `POST` | `/api/leads/ai/summary` | Análisis IA |

---

## 📝 Notas del Desarrollador
* **Validaciones:** El sistema incluye validación de duplicados (email) y manejo de errores consistente con códigos HTTP semánticos.
* **Arquitectura:** Se implementó el patrón *Service-Controller* para desacoplar la lógica de negocio de la capa de transporte (Express).
* **Soft Delete:** Los registros eliminados no se borran físicamente, facilitando auditorías o recuperaciones.

---

**¡Desarrollado con éxito para la prueba técnica de One Million Copy!**
