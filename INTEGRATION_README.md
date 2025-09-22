# Integración Frontend-Backend - Sistema Colegio

## ✅ Configuración Completada

He configurado completamente la integración entre el frontend y backend del Sistema Colegio. Aquí está lo que se ha implementado:

### 🔧 Backend (Puerto 3000)
- **CORS configurado** para permitir conexiones desde `http://localhost:5173`
- **API REST** con endpoints para:
  - `/api/students` - Gestión de estudiantes
  - `/api/courses` - Gestión de cursos
  - `/api/payments` - Gestión de pagos
  - `/api/enrollments` - Gestión de inscripciones
  - `/api/auth` - Autenticación
  - `/api/users` - Gestión de usuarios
  - `/api/roles` - Gestión de roles

### 🎨 Frontend (Puerto 5173)
- **Cliente API** configurado con Axios
- **Hooks personalizados** para consumir servicios del backend
- **Tipos TypeScript** para todas las entidades
- **Páginas actualizadas** con datos reales del backend:
  - **StudentsPage**: Lista de estudiantes con búsqueda y filtros
  - **CoursesPage**: Lista de cursos en formato de tarjetas
  - **PaymentsPage**: Lista de pagos con información detallada

## 🚀 Cómo Ejecutar

### 1. Iniciar el Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Iniciar el Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Ejecutar Ambos Simultáneamente
```bash
# Desde la raíz del proyecto
npm run dev
```

## 📁 Archivos Creados/Modificados

### Frontend
- `src/config/api.ts` - Configuración de endpoints
- `src/services/api.ts` - Cliente HTTP con Axios
- `src/types/api.ts` - Tipos TypeScript para la API
- `src/hooks/useApi.ts` - Hook genérico para API
- `src/hooks/useStudents.ts` - Hook para estudiantes
- `src/hooks/useCourses.ts` - Hook para cursos
- `src/hooks/usePayments.ts` - Hook para pagos
- `src/hooks/useAuth.ts` - Hook para autenticación
- `src/pages/StudentsPage.tsx` - Página actualizada con datos reales
- `src/pages/CoursesPage.tsx` - Página actualizada con datos reales
- `src/pages/PaymentsPage.tsx` - Página actualizada con datos reales

### Backend
- `env.local` - CORS actualizado para puerto 5173

## 🔍 Características Implementadas

### ✅ Gestión de Estudiantes
- Lista de estudiantes con datos reales del backend
- Búsqueda por nombre, apellido o email
- Filtros por estado (activo, inactivo, suspendido)
- Estados de carga y manejo de errores
- Interfaz responsive

### ✅ Gestión de Cursos
- Lista de cursos en formato de tarjetas
- Búsqueda por nombre, código o descripción
- Filtros por estado (activo, inactivo)
- Información de créditos y precios
- Estados de carga y manejo de errores

### ✅ Gestión de Pagos
- Lista de pagos con información detallada
- Búsqueda por estudiante o descripción
- Filtros por estado (completado, pendiente, fallido, reembolsado)
- Información de métodos de pago
- Estados de carga y manejo de errores

## 🛠️ Funcionalidades Técnicas

### Cliente API
- Interceptores para autenticación automática
- Manejo de errores centralizado
- Timeout configurado
- Headers automáticos

### Hooks Personalizados
- `useApi` - Hook genérico para llamadas GET
- `useMutation` - Hook genérico para operaciones POST/PUT/DELETE
- Hooks específicos para cada entidad
- Estados de carga y error integrados

### Manejo de Estados
- Estados de carga con spinners
- Mensajes de error informativos
- Botones de reintento
- Estados vacíos con mensajes apropiados

## 🔐 Autenticación

El sistema está preparado para autenticación JWT:
- Token almacenado en localStorage
- Interceptor automático para incluir token en requests
- Redirección automática en caso de 401
- Hook `useAuth` para manejo de sesión

## 📱 Responsive Design

Todas las páginas están optimizadas para:
- Desktop (tablas completas)
- Tablet (diseño adaptativo)
- Mobile (vista compacta)

## 🎯 Próximos Pasos

Para completar la funcionalidad, puedes implementar:
1. **Formularios de creación/edición** para cada entidad
2. **Modales de confirmación** para eliminaciones
3. **Paginación** real del backend
4. **Filtros avanzados** con múltiples criterios
5. **Exportación de datos** (PDF, Excel)
6. **Dashboard** con estadísticas en tiempo real

## 🐛 Solución de Problemas

### Error de CORS
Si ves errores de CORS, verifica que:
- El backend esté corriendo en puerto 3000
- El frontend esté corriendo en puerto 5173
- El archivo `backend/env.local` tenga `CORS_ORIGIN=http://localhost:5173`

### Error de Conexión
Si no se cargan los datos:
- Verifica que el backend esté ejecutándose
- Revisa la consola del navegador para errores
- Asegúrate de que la base de datos esté configurada

### Datos Vacíos
Si las listas aparecen vacías:
- Verifica que haya datos en la base de datos
- Revisa los logs del backend
- Usa el endpoint `/api/demo/students` para datos de prueba

¡La integración está completa y lista para usar! 🎉

