# Configuración de Base de Datos PostgreSQL

## 📋 Requisitos Previos

1. **PostgreSQL instalado** (versión 12 o superior)
2. **Node.js** (versión 16 o superior)
3. **npm** o **yarn**

## 🚀 Opciones de Instalación

### Opción 1: Instalación Local de PostgreSQL

#### Windows:
1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Instala con las opciones por defecto
3. Recuerda la contraseña del usuario `postgres`

#### macOS:
```bash
# Con Homebrew
brew install postgresql
brew services start postgresql

# O con MacPorts
sudo port install postgresql15
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Opción 2: Docker (Recomendado)

```bash
# Iniciar solo la base de datos
docker-compose up postgres -d

# O iniciar todo el stack
docker-compose up -d
```

## ⚙️ Configuración

### 1. Crear el archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=vipe_school_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=tu-super-secreto-jwt-aqui-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### 2. Crear la base de datos

```sql
-- Conectarse a PostgreSQL como superusuario
psql -U postgres

-- Crear la base de datos
CREATE DATABASE vipe_school_db;

-- Crear un usuario específico (opcional)
CREATE USER vipe_user WITH PASSWORD 'tu_password_aqui';
GRANT ALL PRIVILEGES ON DATABASE vipe_school_db TO vipe_user;

-- Salir
\q
```

### 3. Verificar la conexión

```bash
# Verificar que la base de datos esté corriendo
npm run db:check

# O inicializar la base de datos
npm run db:init
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo con base de datos real
npm run dev

# Desarrollo con base de datos mock
npm run db:mock

# Verificar conexión a la base de datos
npm run db:check

# Inicializar base de datos
npm run db:init

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🐳 Usando Docker

### Iniciar solo la base de datos:
```bash
docker-compose up postgres -d
```

### Iniciar todo el stack:
```bash
docker-compose up -d
```

### Ver logs:
```bash
docker-compose logs -f postgres
```

### Detener servicios:
```bash
docker-compose down
```

## 🔧 Solución de Problemas

### Error de conexión:
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que el puerto 5432 esté disponible
4. Verifica que la base de datos `vipe_school_db` exista

### Error de permisos:
```sql
-- Conectarse como superusuario y otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE vipe_school_db TO tu_usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tu_usuario;
```

### Verificar estado de PostgreSQL:
```bash
# Windows
net start postgresql-x64-15

# Linux/macOS
sudo systemctl status postgresql
# o
brew services list | grep postgres
```

## 📊 Estructura de la Base de Datos

El proyecto creará automáticamente las siguientes tablas:
- `users` - Usuarios del sistema
- `students` - Estudiantes
- `courses` - Cursos
- `enrollments` - Matrículas
- `payments` - Pagos
- `roles` - Roles de usuario

## 🔒 Seguridad

1. **Cambia la contraseña por defecto** de PostgreSQL
2. **Usa un JWT_SECRET fuerte** en producción
3. **No commitees** el archivo `.env` al repositorio
4. **Usa variables de entorno** en producción

## 📝 Notas Importantes

- El proyecto usa **TypeORM** para el ORM
- Las tablas se crean automáticamente en desarrollo (`synchronize: true`)
- En producción, usa migraciones para cambios de esquema
- El proyecto incluye un modo mock para desarrollo sin base de datos
