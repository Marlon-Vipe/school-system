import * as XLSX from 'xlsx';
import type { Student } from '../types/api';

/**
 * Exporta una lista de estudiantes a un archivo Excel
 * @param students - Array de estudiantes a exportar
 * @param filename - Nombre del archivo (opcional)
 */
export const exportStudentsToExcel = (students: Student[], filename?: string) => {
  try {
    // Preparar los datos para Excel
    const excelData = students.map((student, index) => ({
      'N°': index + 1,
      'ID': student.id,
      'Nombre': student.name,
      'Apellido': student.lastName,
      'Email': student.email,
      'Teléfono': student.phone || 'Sin teléfono',
      'Dirección': student.address || 'Sin dirección',
      'Estado': getStatusText(student.status),
      'Fecha de Inscripción': new Date(student.createdAt).toLocaleDateString('es-ES'),
      'Última Actualización': new Date(student.updatedAt).toLocaleDateString('es-ES')
    }));

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Crear una hoja de trabajo con los datos
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Configurar el ancho de las columnas
    const columnWidths = [
      { wch: 5 },   // N°
      { wch: 15 },  // ID
      { wch: 15 },  // Nombre
      { wch: 15 },  // Apellido
      { wch: 25 },  // Email
      { wch: 15 },  // Teléfono
      { wch: 30 },  // Dirección
      { wch: 12 },  // Estado
      { wch: 18 },  // Fecha de Inscripción
      { wch: 18 }   // Última Actualización
    ];
    worksheet['!cols'] = columnWidths;
    
    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');
    
    // Generar el nombre del archivo con fecha y hora
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const defaultFilename = `estudiantes_${timestamp}.xlsx`;
    
    // Descargar el archivo
    XLSX.writeFile(workbook, filename || defaultFilename);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    throw new Error('Error al generar el archivo Excel');
  }
};

/**
 * Exporta estudiantes filtrados con información adicional
 * @param students - Array de estudiantes a exportar
 * @param filters - Filtros aplicados
 * @param filename - Nombre del archivo (opcional)
 */
export const exportFilteredStudentsToExcel = (
  students: Student[], 
  filters: {
    searchTerm?: string;
    status?: string;
  },
  filename?: string
) => {
  try {
    // Preparar los datos para Excel
    const excelData = students.map((student, index) => ({
      'N°': index + 1,
      'ID': student.id,
      'Nombre': student.name,
      'Apellido': student.lastName,
      'Email': student.email,
      'Teléfono': student.phone || 'Sin teléfono',
      'Dirección': student.address || 'Sin dirección',
      'Estado': getStatusText(student.status),
      'Fecha de Inscripción': new Date(student.createdAt).toLocaleDateString('es-ES'),
      'Última Actualización': new Date(student.updatedAt).toLocaleDateString('es-ES')
    }));

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Crear una hoja de trabajo con los datos
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Configurar el ancho de las columnas
    const columnWidths = [
      { wch: 5 },   // N°
      { wch: 15 },  // ID
      { wch: 15 },  // Nombre
      { wch: 15 },  // Apellido
      { wch: 25 },  // Email
      { wch: 15 },  // Teléfono
      { wch: 30 },  // Dirección
      { wch: 12 },  // Estado
      { wch: 18 },  // Fecha de Inscripción
      { wch: 18 }   // Última Actualización
    ];
    worksheet['!cols'] = columnWidths;
    
    // Agregar información de filtros si existen
    if (filters.searchTerm || filters.status) {
      const filterInfo = [];
      if (filters.searchTerm) {
        filterInfo.push(`Búsqueda: "${filters.searchTerm}"`);
      }
      if (filters.status && filters.status !== 'all') {
        filterInfo.push(`Estado: ${getStatusText(filters.status)}`);
      }
      
      // Agregar información de filtros al inicio de la hoja
      const filterRow = ['Información de Filtros:', filterInfo.join(' | ')];
      XLSX.utils.sheet_add_aoa(worksheet, [filterRow], { origin: 'A1' });
      
      // Mover los datos hacia abajo
      XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: 'A2' });
      XLSX.utils.sheet_add_json(worksheet, excelData, { origin: 'A3' });
    }
    
    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');
    
    // Generar el nombre del archivo con fecha y hora
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const defaultFilename = `estudiantes_filtrados_${timestamp}.xlsx`;
    
    // Descargar el archivo
    XLSX.writeFile(workbook, filename || defaultFilename);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    throw new Error('Error al generar el archivo Excel');
  }
};

/**
 * Convierte el status del estudiante a texto legible
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case 'active': return 'Activo';
    case 'inactive': return 'Inactivo';
    case 'suspended': return 'Suspendido';
    default: return status;
  }
};
