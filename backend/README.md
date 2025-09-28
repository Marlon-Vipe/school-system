# Vipe School API

API RESTful para el Sistema de Gestión Educativa (SGE) desarrollada con Node.js, TypeScript, Express y TypeORM.

## 🚀 Características

- **Arquitectura Clean**: Implementación de Clean Architecture y DDD simplificado
- **TypeScript**: Tipado fuerte en toda la aplicación
- **TypeORM**: ORM para PostgreSQL con decoradores
- **Autenticación JWT**: Sistema de autenticación basado en tokens
- **Validación**: Validación robusta con Joi
- **Manejo de Errores**: Sistema centralizado de manejo de errores
- **Docker**: Contenedores para desarrollo y producción
- **Documentación**: API bien documentada

## 📋 Módulos Implementados

### ✅ Completamente Implementados
- **Autenticación**: Login, registro, perfil de usuario
- **Estudiantes**: CRUD completo con paginación y filtros

### 🔄 Placeholders (Estructura Básica)
- **Cursos**: Gestión de cursos
- **Inscripciones**: Sistema de inscripciones
- **Pagos**: Gestión de pagos
- **Usuarios**: Administración de usuarios
- **Roles y Permisos**: Sistema de roles

## 🛠️ Tecnologías

- **Backend**: Node.js, Express.js, TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Validación**: Joi
- **Autenticación**: JWT
- **Contenedores**: Docker, Docker Compose
- **Seguridad**: Helmet, CORS

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- Docker (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd api-vipe-school
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb vipe_school_db
```

5. **Ejecutar migraciones** (si las hay)
```bash
npm run build
npm start
```

### Instalación con Docker

1. **Clonar y configurar**
```bash
git clone <repository-url>
cd api-vipe-school
cp env.example .env
```

2. **Ejecutar con Docker Compose**
```bash
docker-compose up -d
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Información General
- `GET /` - Página principal
- `GET /api` - Información de la API y endpoints disponibles
- `GET /api/health` - Health check del servidor

### Endpoints Públicos (Sin Autenticación)
- `GET /api/demo/students` - Datos demo de estudiantes (sin autenticación)

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (admin)
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar contraseña

### Estudiantes (Requiere Autenticación)
- `GET /api/students` - Listar estudiantes (con paginación y filtros)
- `GET /api/students/:id` - Obtener estudiante por ID
- `POST /api/students` - Crear estudiante
- `PUT /api/students/:id` - Actualizar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante
- `GET /api/students/stats` - Estadísticas de estudiantes
- `GET /api/students/recent` - Estudiantes recientes

### Otros Módulos (Requieren Autenticación)
- `GET /api/courses` - Listar cursos
- `GET /api/enrollments` - Listar inscripciones
- `GET /api/payments` - Listar pagos
- `GET /api/users` - Listar usuarios

## 🔧 Configuración

### Variables de Entorno

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=vipe_school_db

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/           # Configuraciones
├── middlewares/      # Middlewares personalizados
├── modules/          # Módulos de la aplicación
│   ├── auth/         # Autenticación
│   ├── students/     # Estudiantes (completo)
│   ├── courses/      # Cursos (placeholder)
│   ├── enrollments/  # Inscripciones (placeholder)
│   ├── payments/     # Pagos (placeholder)
│   ├── users/        # Usuarios (placeholder)
│   └── roles/        # Roles (placeholder)
├── types/            # Tipos TypeScript
├── utils/            # Utilidades
├── app.ts            # Configuración de Express
└── server.ts         # Punto de entrada
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📝 Scripts Disponibles

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar en producción
- `npm run lint` - Linter
- `npm run lint:fix` - Corregir errores de linting

## 🐳 Docker

### Desarrollo
```bash
docker-compose up -d
```

### Producción
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte, contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)



