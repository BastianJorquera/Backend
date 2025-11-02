

## Backend de e-commerce, contiene las siguiente funcionalidades:<br>
Se conecta a la BD.<br>
Carga los modelos.<br>
Permite registrar usuarios (encriptando la contraseña). <br>
Permite iniciar sesión (comparando la contraseña encriptada). <br>
Genera tokens JWT.<br>
Protege rutas usando esos tokens.


## Puesta en Marcha del Backend

### 1. Prerrequisitos

- Node.js (v20.x o superior)
- PostgreSQL (y PgAdmin, opcionalmente)
- npm (usualmente viene con Node.js)

### 2. Configuración

1.  Clonar el repositorio:
    `git clone ...`
2.  Navegar a la carpeta del backend e instalar dependencias:
    `npm install`

### 3. Configuración de la Base de Datos

1.  Asegúrate de que tu servicio de PostgreSQL esté corriendo.
2.  Usando una herramienta como PgAdmin o `psql`, crea una nueva base de datos vacía. (ej. `card_hunters_db`).
3.  **Importante:** Abre el archivo `/db/init.sql` de este proyecto, copia su contenido y ejecútalo en la base de datos que acabas de crear. Esto creará todas las tablas y relaciones necesarias.

### 4. Variables de Entorno

1.  Crea un archivo llamado `.env` en la raíz del proyecto backend.
2.  Copia y pega el siguiente contenido, reemplazando los valores con tus credenciales:

    ```
    PORT=3000
    SECRET_KEY_JWT=unaClaveSuperSecretaParaTusTokens
    DB_NAME=card_hunters_db
    DB_USER=postgres
    DB_PASSWORD=tu_contraseña_postgres
    DB_HOST=localhost
    ```

### 5. Iniciar el Servidor

Una vez configurada la base de datos y el archivo `.env`, inicia el servidor:

`npm start`

El servidor debería iniciarse y mostrar `Servidor corriendo en el puerto 3000` y `Conexión a la base de datos establecida correctamente.`.