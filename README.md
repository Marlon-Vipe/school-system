# 🏫 Sistema Colegio - School Management System

Un sistema completo de gestión escolar desarrollado con **React**, **TypeScript**, **Node.js**, **Express** y **PostgreSQL**.

## 🚀 Características Principales

### 📊 Dashboard
- Estadísticas en tiempo real
- Resumen de ingresos y egresos
- Control de caja integrado
- Métricas de estudiantes y cursos

### 👥 Gestión de Estudiantes
- CRUD completo de estudiantes
- Búsqueda y filtrado avanzado
- Paginación optimizada
- Validación de datos

### 📚 Gestión de Cursos
- Administración de cursos
- Categorización por materias
- Control de capacidad
- Seguimiento de inscripciones

### 💰 Módulo de Caja
- Registro de ingresos y egresos
- Categorización automática
- Estados: Pendiente, Confirmado, Cancelado
- Estadísticas financieras en tiempo real
- Formato de moneda: $100,500.00

### 💳 Sistema de Pagos
- Procesamiento de pagos
- Estados de pago
- Integración con módulo de caja
- Confirmación de transacciones

### 📝 Sistema de Inscripciones
- Inscripción de estudiantes a cursos
- Control de cupos disponibles
- Estados de inscripción
- Historial completo

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Headless UI** para componentes
- **Vite** como bundler

### Backend
- **Node.js** con TypeScript
- **Express.js** como framework
- **TypeORM** para ORM
- **PostgreSQL** como base de datos
- **Docker** para contenedores

### Base de Datos
- **PostgreSQL** con Docker
- Migraciones automáticas
- Triggers para auditoría
- Índices optimizados

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Marlon-Vipe/school-system.git
cd school-system
```

### 2. Configurar Base de Datos
```bash
# Iniciar PostgreSQL con Docker
docker-compose -f backend/docker-compose.yml up -d

# Ejecutar migraciones
docker exec vipe-school-db psql -U postgres -d vipe_school_db -f /docker-entrypoint-initdb.d/init-db.sql
```

### 3. Configurar Backend
```bash
cd backend
npm install

# Copiar archivo de configuración
cp env.example env.local

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Configurar Frontend
```bash
cd frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🚀 Scripts Disponibles

### Backend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar TypeScript
npm run start        # Servidor de producción
npm run test         # Ejecutar pruebas
```

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 📁 Estructura del Proyecto

```
sistema-colegio/
├── backend/
│   ├── src/
│   │   ├── modules/          # Módulos de la aplicación
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── cash/         # Gestión de caja
│   │   │   ├── courses/      # Gestión de cursos
│   │   │   ├── enrollments/ # Inscripciones
│   │   │   ├── payments/     # Pagos
│   │   │   ├── students/     # Estudiantes
│   │   │   └── users/        # Usuarios
│   │   ├── config/           # Configuración
│   │   ├── middlewares/      # Middlewares
│   │   └── utils/            # Utilidades
│   ├── migrations/           # Migraciones de BD
│   └── scripts/              # Scripts de utilidad
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Páginas
│   │   ├── services/         # Servicios API
│   │   └── types/            # Tipos TypeScript
│   └── public/               # Archivos públicos
└── docs/                     # Documentación
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno (Backend)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vipe_school_db
DB_USER=postgres
DB_PASSWORD=postgres

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Variables de Entorno (Frontend)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Sistema Colegio
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil de usuario

### Estudiantes
- `GET /api/students` - Listar estudiantes
- `POST /api/students` - Crear estudiante
- `PUT /api/students/:id` - Actualizar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante

### Cursos
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso
- `PUT /api/courses/:id` - Actualizar curso
- `DELETE /api/courses/:id` - Eliminar curso

### Caja
- `GET /api/cash` - Listar entradas de caja
- `POST /api/cash` - Crear entrada
- `PUT /api/cash/:id` - Actualizar entrada
- `DELETE /api/cash/:id` - Eliminar entrada
- `PATCH /api/cash/:id/confirm` - Confirmar entrada
- `PATCH /api/cash/:id/cancel` - Cancelar entrada

### Pagos
- `GET /api/payments` - Listar pagos
- `POST /api/payments` - Crear pago
- `PUT /api/payments/:id` - Actualizar pago
- `DELETE /api/payments/:id` - Eliminar pago
- `POST /api/payments/:id/status` - Actualizar estado

## 🎨 Características de la UI

### Diseño Responsivo
- Mobile-first approach
- Breakpoints optimizados
- Componentes adaptativos

### Componentes Reutilizables
- Formularios con validación
- Modales de confirmación
- Tablas con paginación
- Filtros avanzados

### Experiencia de Usuario
- Loading states
- Error handling
- Feedback visual
- Navegación intuitiva

## 🔒 Seguridad

- Autenticación JWT
- Validación de datos
- Sanitización de inputs
- CORS configurado
- Rate limiting

## 📈 Rendimiento

- Paginación optimizada (50 registros/página)
- Lazy loading de componentes
- Caching de datos
- Optimización de queries

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🐳 Docker

### Desarrollo
```bash
# Base de datos
docker-compose -f backend/docker-compose.yml up -d

# Backend (opcional)
docker build -t school-backend ./backend
docker run -p 3001:3001 school-backend
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Marlon Vipe** - *Desarrollo completo* - [Marlon-Vipe](https://github.com/Marlon-Vipe)

## 🙏 Agradecimientos

- React Team por el excelente framework
- Tailwind CSS por el sistema de diseño
- PostgreSQL por la robusta base de datos
- Docker por la containerización

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, puedes:

- Abrir un issue en GitHub
- Contactar al desarrollador
- Revisar la documentación

---

⭐ **¡Dale una estrella al proyecto si te gusta!** ⭐
