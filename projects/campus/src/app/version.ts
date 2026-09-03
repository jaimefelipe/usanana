export interface Release {
  version: string;
  fecha: string;
  titulo: string;
  modulo: string;
  cambios: string[];
}

export const RELEASES: Release[] = [
  {
    version: '1.0.0',
    fecha: '2026-08-04',
    titulo: 'Campus estudiantil integrado',
    modulo: 'General',
    cambios: [
      'Inicio de Campus con cursos activos, acciones rapidas y acceso a Biblioteca',
      'Aulas virtuales visibles solo para matriculas activas y grupos abiertos',
      'Entrega de actividades conectada con Academico'
    ]
  },
  {
    version: '1.0.1',
    fecha: '2026-08-12',
    titulo: 'Version visible y validacion de acceso',
    modulo: 'General',
    cambios: [
      'Campus muestra la version ejecutada y una vista de novedades para estudiantes',
      'El login normaliza el correo antes de validar usuario y empresa',
      'Se documenta el ajuste para evitar usuarios creados sin asociacion valida a empresa'
    ]
  },
  {
    version: '1.0.2',
    fecha: '2026-08-21',
    titulo: 'Biblioteca Campus sincronizada',
    modulo: 'Biblioteca',
    cambios: [
      'Mi Biblioteca usa el usuario real de Seguridad y ya no crea usuarios sombra de Biblioteca',
      'Prestamos y reservas se consultan con los mismos estados efectivos que Biblioteca',
      'Las reservas desde Campus quedan en lista de espera y respetan estados bloqueantes activos'
    ]
  },
  {
    version: '1.0.3',
    fecha: '2026-08-29',
    titulo: 'Prestamo directo y fix critico de reservas',
    modulo: 'Biblioteca',
    cambios: [
      'La ficha del libro ahora ofrece Solicitar prestamo cuando hay ejemplares disponibles, y Solicitar reserva solo cuando no los hay',
      'Corregido el error de base de datos que bloqueaba toda reserva desde Campus (ck_reserva_estado)',
      'El prestamo directo valida el limite combinado de prestamos y reservas activos antes de registrar'
    ]
  },
  {
    version: '1.0.4',
    fecha: '2026-08-31',
    titulo: 'Licencia del recurso visible en la ficha',
    modulo: 'Biblioteca',
    cambios: [
      'La ficha del libro muestra si la licencia es abierta (CC-BY/CC-BY-SA) o privada, definida en Biblioteca desde la etiqueta MARC 533',
      'Este dato es la base para diferenciar mas adelante el flujo de acceso abierto del flujo con prestamo'
    ]
  },
  {
    version: '1.0.5',
    fecha: '2026-09-01',
    titulo: 'Catalogo con portada y licencia',
    modulo: 'Biblioteca',
    cambios: [
      'El catalogo de Biblioteca en Campus muestra la portada del libro y un badge de licencia (abierta/privada), igual que el OPAC de Biblioteca',
      'Se agrego un resumen corto por libro en cada tarjeta de resultados'
    ]
  }
];

export const VERSION_ACTUAL: Release = RELEASES[RELEASES.length - 1];

