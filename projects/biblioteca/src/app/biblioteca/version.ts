export interface Release {
  version: string;
  fecha: string;
  titulo: string;
  modulo: string;
  cambios: string[];
}

// Historial de versiones — se actualiza después de implementar cada release.
// La ÚLTIMA entrada de este array es la versión actualmente en producción.
export const RELEASES: Release[] = [
  {
    version: '0.0',
    fecha: '2026-07-04',
    titulo: 'Versión inicial',
    modulo: 'General',
    cambios: [
      'Estructura inicial del módulo biblioteca',
      'Componentes base creados con datos de prueba'
    ]
  },
  {
    version: '0.2',
    fecha: '2026-07-08',
    titulo: 'Auditoría de reconciliación + datos reales',
    modulo: 'Infraestructura',
    cambios: [
      'Confirmado uso de datos reales vía ApiService compartido (eps_execSql_v21.php)',
      'Auditados los 24 releases planificados contra el código real',
      'PLAN_RELEASES.md corregido para reflejar el estado verdadero del módulo'
    ]
  },
  {
    version: '1.0',
    fecha: '2026-07-08',
    titulo: 'Menú Catalogación + Categoría opcional',
    modulo: 'Catalogación',
    cambios: [
      'Menú lateral renombrado de "Operación" a "Catalogación"',
      'Sección de datos de referencia renombrada a "Configuración" (confirmado contra PDF de requerimientos)',
      'Confirmado que Categoría es opcional al catalogar un libro; placeholder actualizado a "Sin categoría"'
    ]
  },
  {
    version: '1.1',
    fecha: '2026-07-09',
    titulo: 'Autoguardado de borrador + navegación persistente + paginación arriba',
    modulo: 'Catalogación',
    cambios: [
      'Autoguardado de borrador en sessionStorage al catalogar un libro (catálogo simple y catalogación MARC), con opción de recuperar cambios sin guardar',
      'La sección activa del menú lateral permanece expandida al navegar a otra pantalla y volver',
      'Nuevo componente reutilizable app-paginador; el listado de catalogación MARC ahora muestra el control de paginación arriba y abajo de los resultados'
    ]
  },
  {
    version: '1.2',
    fecha: '2026-07-10',
    titulo: 'Ejemplares: imagen de portada + usuarios simultáneos',
    modulo: 'Catalogación',
    cambios: [
      'Formulario de Ejemplar: campo de imagen de portada (subida como base64) y máximo de usuarios simultáneos para recursos digitales',
      'Listado de Ejemplares: contador de cuántos son de tipo PDF y enlace visible al número de recurso (libro) de cada ejemplar',
      'Pendiente: ejecutar script SQL que agrega las columnas Imagen_Portada y Max_Simultaneos en Bib_Ejemplar antes de que el guardado funcione en producción'
    ]
  },
  {
    version: '1.3',
    fecha: '2026-07-14',
    titulo: 'Múltiples autores por registro + rol por autor',
    modulo: 'Catalogación',
    cambios: [
      'Buscador de autores con autocompletar (reemplaza el select múltiple) al catalogar un libro',
      'Cada autor agregado tiene un rol propio: Autor, Coautor, Editor, Traductor o Ilustrador',
      'Al editar un libro existente, se recuperan los autores y roles ya guardados'
    ]
  },
  {
    version: '1.3.1',
    fecha: '2026-07-15',
    titulo: 'Ejemplares: portada por URL + paginación real (fix + migración de datos)',
    modulo: 'Catalogación',
    cambios: [
      'La imagen de portada del ejemplar ahora se sube al servidor y se guarda su URL, en vez de un base64 completo en la base de datos',
      'El listado de Ejemplares ahora pagina de verdad; antes se cortaba en 50 sin poder ver el resto',
      'El contador de ejemplares en PDF ahora refleja el total real, no solo la página cargada',
      'Se migraron las 50 portadas que ya estaban guardadas en base64 (creadas antes de este fix): se subieron como archivos reales al servidor y se actualizó cada registro con su URL. Ningún usuario perdió su imagen ni necesita volver a subirla'
    ]
  },
  {
    version: '1.4',
    fecha: '2026-07-16',
    titulo: 'Autoridades: búsqueda por etiqueta + un registro por autor',
    modulo: 'Catalogación',
    cambios: [
      'Cada autoridad puede vincularse a un autor del catálogo, para reutilizar el mismo registro en todos sus libros',
      'Buscador de autores con autocompletar para vincular una autoridad; avisa si ese autor ya tiene una para no duplicar',
      'Nueva búsqueda de autoridades por etiqueta MARC: autor personal (100), nombre alternativo (400) y véase además (500)'
    ]
  },
  {
    version: '1.5',
    fecha: '2026-07-18',
    titulo: 'Integración MARC -> Catalogación',
    modulo: 'Catalogación',
    cambios: [
      'Al catalogar en MARC, el ISBN, el año de publicación y el resumen del libro ahora se completan automáticamente desde las etiquetas 020, 264 y 520',
      'Estos campos ya se ven en el formulario de catalogación MARC, junto al título (que ya se sincronizaba)',
      'El autor y la editorial no se sincronizan en automático: requieren vincularse desde el catálogo, no como texto libre'
    ]
  },
  {
    version: '1.6',
    fecha: '2026-07-28',
    titulo: 'Validacion de limite y sanciones en circulacion digital',
    modulo: 'Circulacion',
    cambios: [
      'Antes de crear un prestamo o reserva, el sistema valida que el usuario biblioteca exista, no este bloqueado y no tenga sanciones activas',
      'El limite combinado de prestamos y reservas activos se lee desde Bib_Politica_Prestamo, con politica default si no hay registro configurado',
      'Los mensajes de error muestran cuantos elementos activos tiene el usuario y cual es el limite permitido'
    ]
  },
  {
    version: '1.6.1',
    fecha: '2026-07-29',
    titulo: 'Ejemplares: carga separada de documento y portada',
    modulo: 'Catalogacion',
    cambios: [
      'El formulario de Ejemplares ahora muestra por separado el campo Archivo digital y el campo Imagen de portada',
      'El archivo digital acepta PDF y Word (.doc, .docx), y al seleccionarlo marca el ejemplar como digital',
      'Si se intenta cargar un documento en el campo de portada, el sistema lo toma como archivo digital y avisa que la portada debe ser imagen'
    ]
  },
  {
    version: '1.6.2',
    fecha: '2026-07-29',
    titulo: 'Menu Seguridad para roles y permisos',
    modulo: 'Seguridad',
    cambios: [
      'El menu lateral ahora incluye la seccion Seguridad',
      'Seguridad agrupa accesos directos a Roles, Permisos, Roles permisos y Usuarios roles',
      'La configuracion de permisos de subida de archivos digitales queda accesible sin usar URLs manuales'
    ]
  },
  {
    version: '1.6.3',
    fecha: '2026-07-29',
    titulo: 'Seguridad base predefinida',
    modulo: 'Seguridad',
    cambios: [
      'Se definieron roles institucionales fijos: Administrador, Bibliotecario, Docente, Estudiante y Administrativo',
      'Se definio una matriz base de permisos para catalogacion, archivos digitales, circulacion, reportes, adquisiciones, OPAC y seguridad',
      'Se preparo un script SQL idempotente para crear roles, permisos y asignaciones sin que el usuario deba inventar la arquitectura'
    ]
  },
  {
    version: '1.6.4',
    fecha: '2026-07-29',
    titulo: 'Usuarios unificados con Seguridad',
    modulo: 'Seguridad',
    cambios: [
      'Usuarios roles ahora lista los usuarios activos de Seguridad asociados a la empresa, no una tabla propia de Biblioteca',
      'Los roles de Biblioteca se asignan sobre Seg_Usuario.Id_Usuario para mantener un unico usuario en todo el sistema',
      'Se preparo la migracion SQL para convertir referencias existentes, renombrar la relacion de roles y eliminar Bib_Usuario_Biblioteca'
    ]
  },
  {
    version: '1.6.5',
    fecha: '2026-07-29',
    titulo: 'Selector buscable de usuarios en roles',
    modulo: 'Seguridad',
    cambios: [
      'La asignacion de roles reemplaza el dropdown de usuarios por un selector con modal',
      'El modal permite buscar usuarios por nombre, correo o codigo antes de seleccionarlos',
      'El formulario muestra el usuario seleccionado en un campo de lectura con boton de busqueda'
    ]
  },
  {
    version: '1.6.6',
    fecha: '2026-07-29',
    titulo: 'Estandar visual de selector buscable',
    modulo: 'Seguridad',
    cambios: [
      'El selector de usuario en roles adopta el estandar visual del sistema: boton de busqueda a la izquierda y campo gris de lectura a la derecha',
      'El campo seleccionado tambien abre el modal buscable al hacer clic',
      'Se documento el patron para reutilizarlo en proximos selectores con modal'
    ]
  },
  {
    version: '1.6.7',
    fecha: '2026-07-29',
    titulo: 'Validacion de migracion usuario-rol',
    modulo: 'Seguridad',
    cambios: [
      'La asignacion de roles valida si Bib_Usuario_Rol ya usa Seg_Usuario.Id_Usuario antes de guardar',
      'Si la base no esta migrada, muestra la migracion pendiente en vez del error tecnico Unknown column Id_Usuario',
      'Se preparo el script puntual idempotente docs/sql/biblioteca-v1-6-7-migrar-usuario-rol.sql para corregir la tabla de roles de usuario'
    ]
  },
  {
    version: '1.6.8',
    fecha: '2026-07-29',
    titulo: 'Edicion real de usuarios roles',
    modulo: 'Seguridad',
    cambios: [
      'Al editar una asignacion existente de usuario y rol, el sistema actualiza el registro seleccionado en vez de insertar uno nuevo',
      'El formulario diferencia visualmente entre nueva asignacion y edicion de asignacion',
      'El formulario permite eliminar una asignacion existente para corregir duplicados creados antes de este ajuste'
    ]
  },
  {
    version: '1.7',
    fecha: '2026-07-30',
    titulo: 'Circulacion digital: seis vistas operativas',
    modulo: 'Circulacion',
    cambios: [
      'La pantalla de Prestamos ahora organiza la circulacion digital en seis tabs: Activos, Pendientes, Reservados, Renovaciones, Vencidos e Historial',
      'Pendientes queda como vista de monitoreo automatico, sin botones Aprobar/Rechazar, segun el flujo digital confirmado',
      'Reservados muestra reservas activas con posicion en lista de espera y Renovaciones muestra prestamos con renovaciones realizadas'
    ]
  },
  {
    version: '1.7.1',
    fecha: '2026-07-30',
    titulo: 'Menu de Circulacion digital',
    modulo: 'Circulacion',
    cambios: [
      'El menu lateral ahora muestra la seccion Circulacion',
      'La opcion Circulacion digital abre la pantalla de seis vistas operativas',
      'La pantalla fue renombrada de Prestamos a Circulacion digital para coincidir con el release'
    ]
  },
  {
    version: '1.7.2',
    fecha: '2026-07-30',
    titulo: 'Menu completo de Circulacion',
    modulo: 'Circulacion',
    cambios: [
      'La seccion Circulacion ahora muestra Prestamos como opcion visible del menu',
      'Tambien quedan accesibles Reservas, Politicas de prestamo y Multas',
      'Prestamos abre la vista operativa de circulacion digital con los seis tabs del release v1.7'
    ]
  },
  {
    version: '1.8',
    fecha: '2026-08-03',
    titulo: 'Usuarios activos por tipo en Circulacion',
    modulo: 'Circulacion',
    cambios: [
      'Circulacion digital muestra contadores de usuarios activos por tipo: Estudiantes, Docentes y Administrativos',
      'Los conteos se toman desde Seguridad usando Seg_Usuario_Empresa y Seg_Usuario, no desde una tabla propia de Biblioteca',
      'El conteo filtra por empresa y por usuarios activos para mantener consistencia con la arquitectura del sistema'
    ]
  },
  {
    version: '1.8.1',
    fecha: '2026-08-04',
    titulo: 'Matriz efectiva de permisos por rol',
    modulo: 'Seguridad',
    cambios: [
      'Al validar permisos, Biblioteca asegura la matriz base de roles y permisos si falta una asignacion interna',
      'Un usuario con rol Administrador hereda correctamente el permiso biblioteca.archivo.subir para Ejemplares',
      'Los roles no administradores siguen sujetos a la matriz granular definida en Bib_Rol_Permiso'
    ]
  },
  {
    version: '1.8.2',
    fecha: '2026-08-04',
    titulo: 'Validacion de permisos sin bucle de consultas',
    modulo: 'Seguridad',
    cambios: [
      'La validacion de permisos ya no intenta sembrar la matriz de roles durante la carga de pantallas',
      'Administrador obtiene permisos base de Biblioteca como permisos efectivos de solo lectura',
      'Ejemplares evita el bucle de consultas a Bib_Rol_Permiso al determinar si puede subir archivos'
    ]
  },
  {
    version: '1.8.3',
    fecha: '2026-08-04',
    titulo: 'Permisos de Administrador con SQL explicito',
    modulo: 'Seguridad',
    cambios: [
      'La validacion de permisos usa una sola consulta SQL con filtros explicitos por empresa',
      'El rol Administrador se reconoce con TRIM/LOWER para evitar fallos por mayusculas o espacios',
      'Ejemplares habilita la carga de archivo digital cuando el usuario tiene rol Administrador'
    ]
  },
  {
    version: '1.8.4',
    fecha: '2026-08-06',
    titulo: 'Recuperacion completa de etiquetas MARC y borradores',
    modulo: 'Catalogacion',
    cambios: [
      'Al editar un registro MARC se cargan todos los campos guardados, no solo las etiquetas visibles en la pagina actual',
      'Las consultas de campos y subcampos MARC evitan el limite de paginacion para no perder etiquetas guardadas',
      'Los borradores MARC conservan formato, pagina, filtro y valores capturados; al guardar se limpia tambien el borrador nuevo para evitar recuperaciones obsoletas'
    ]
  },
  {
    version: '1.8.5',
    fecha: '2026-08-06',
    titulo: 'Carga bajo demanda del modulo Biblioteca',
    modulo: 'Rendimiento',
    cambios: [
      'El modulo Biblioteca deja de cargarse de forma ansiosa durante el arranque de la aplicacion',
      'Las rutas de Biblioteca se cargan bajo demanda desde el router raiz para reducir el JavaScript inicial',
      'Se removieron jQuery y Bootstrap JS del build de Biblioteca porque el modulo no los usa y sus menues/modales son propios de Angular',
      'Seguridad se mantiene en el arranque para preservar las rutas legacy de login, registro y cambio de clave sin redireccionar usuarios'
    ]
  },
  {
    version: '1.8.6',
    fecha: '2026-08-10',
    titulo: 'Borradores MARC solo con cambios reales',
    modulo: 'Catalogacion',
    cambios: [
      'El formulario MARC deja de guardar borrador por cualquier input o cambio global de la pantalla',
      'El borrador se compara contra una huella limpia del registro cargado desde base para evitar falsos borradores al abrir, filtrar o paginar',
      'Si el usuario vuelve a dejar el registro igual que la base, el borrador pendiente se elimina automaticamente'
    ]
  },
  {
    version: '1.9',
    fecha: '2026-08-10',
    titulo: 'Renovacion bloqueada por reservas y aviso al siguiente',
    modulo: 'Circulacion',
    cambios: [
      'La renovacion de un prestamo se bloquea cuando existen reservas activas o usuarios en lista de espera para el mismo titulo',
      'Al devolver un ejemplar, el primer usuario de la lista pasa a Disponible y se reordenan las posiciones restantes',
      'OPAC Mi cuenta muestra si una reserva esta disponible o la posicion actual del usuario en la lista de espera'
    ]
  },
  {
    version: '1.9.1',
    fecha: '2026-08-17',
    titulo: 'Dashboard de monitoreo operativo',
    modulo: 'Inicio',
    cambios: [
      'Inicio muestra un bloque de monitoreo de circulacion con salud operativa del dia',
      'El resumen distingue prestamos activos, prestamos vencidos y reservas activas con estados visuales',
      'El dashboard muestra alertas accionables y estados de carga/error sin agregar consultas nuevas'
    ]
  },
  {
    version: '2.0',
    fecha: '2026-08-17',
    titulo: 'Corte automatico de acceso vencido',
    modulo: 'Circulacion',
    cambios: [
      'Los prestamos activos o pendientes con fecha vencida se muestran como vencidos de forma automatica',
      'Circulacion y Mi cuenta bloquean la renovacion cuando el acceso ya esta vencido',
      'Se muestra aviso operativo de vencimientos sin crear multas automaticas ni liberar ejemplares por escritura masiva'
    ]
  },
  {
    version: '2.0.1',
    fecha: '2026-08-21',
    titulo: 'Campus sincronizado con usuarios y prestamos reales',
    modulo: 'Campus/Biblioteca',
    cambios: [
      'Campus deja de usar usuarios sombra de Biblioteca y consulta Seg_Usuario como fuente unica',
      'Mi Biblioteca en Campus muestra prestamos vencidos y reservas con los mismos estados efectivos de Biblioteca',
      'Las reservas creadas desde Campus usan Usuario_Id real, empresa y auditoria automatica del ApiService'
    ]
  },
  {
    version: '2.0.2',
    fecha: '2026-08-29',
    titulo: 'Fix critico: reservas y catalogacion sin ISBN',
    modulo: 'Circulacion',
    cambios: [
      'Corregido el CHECK de Bib_Reserva que rechazaba el estado En espera/Disponible: ninguna reserva se podia registrar en produccion (Biblioteca ni Campus)',
      'Catalogar un segundo registro sin ISBN ya no falla: el ISBN vacio se guarda como NULL en vez de cadena vacia',
      'El identificador del libro recien creado se lee del campo real que devuelve el backend (Identity), evitando el error No se pudo obtener el identificador del libro'
    ]
  },
  {
    version: '2.1',
    fecha: '2026-08-29',
    titulo: 'Licencia visible via etiqueta MARC 533',
    modulo: 'Circulacion',
    cambios: [
      'El subcampo 533 $a de MARC ahora se captura con un selector: CC-BY, CC-BY-SA o Licencia Privada, en vez de texto libre',
      'Al guardar el registro MARC, la licencia del libro se deriva del 533 y queda disponible en Bib_Libro.Licencia',
      'El catalogo interno de Biblioteca muestra un badge de Licencia abierta/privada por libro',
      'Campus muestra el mismo badge en la ficha del recurso (libro-detalle), como base para diferenciar el flujo de acceso abierto del flujo con prestamo en proximos releases'
    ]
  },
  {
    version: '2.2',
    fecha: '2026-09-03',
    titulo: 'OPAC: tarjetas de resultados enriquecidas',
    modulo: 'OPAC',
    cambios: [
      'El catalogo publico (OPAC) muestra portada, estado de disponibilidad y licencia por libro, con resumen visible en la tarjeta',
      'Se puede solicitar prestamo o reservar directamente desde el listado de resultados, sin entrar al detalle',
      'Boton Descargar visible para recursos de acceso abierto con archivo digital, y boton de favorito (guardado local del navegador)',
      'Campus muestra la misma portada y licencia en el catalogo del estudiante'
    ]
  },
  {
    version: '2.3',
    fecha: '2026-09-03',
    titulo: 'OPAC: ficha completa del recurso',
    modulo: 'OPAC',
    cambios: [
      'La ficha publica de un libro (opac-detalle) ahora muestra portada, badges de disponibilidad y licencia, y la tabla de ejemplares con su estado',
      'Se puede solicitar prestamo o reservar directamente desde la ficha, igual que ya funcionaba en Campus',
      'Boton Descargar visible cuando el recurso es de acceso abierto y tiene un ejemplar digital'
    ]
  },
  {
    version: '2.3.1',
    fecha: '2026-09-03',
    titulo: 'Hotfix: portadas no se mostraban en catalogo/ficha',
    modulo: 'OPAC',
    cambios: [
      'Corregida la causa raiz: ApiService convierte cualquier comilla vacia en NULL antes de enviar el SQL, lo que rompia el filtro de portadas (columna <> \'\')',
      'Portada agregada tambien a la ficha de Campus y al catalogo interno de Biblioteca, que se habian quedado sin ella al implementar v2.2'
    ]
  },
  {
    version: '2.4',
    fecha: '2026-09-08',
    titulo: 'Busqueda basica mapeada a MARC',
    modulo: 'OPAC',
    cambios: [
      'La busqueda del OPAC ahora consulta la base de datos real (antes filtraba solo lo ya cargado en el navegador)',
      'Un mismo termino de busqueda encuentra coincidencias por titulo, autor, ISBN, ISSN, DOI y tema/palabras clave',
      'Campus recibe la misma cobertura de busqueda en su catalogo'
    ]
  }
  // Los releases se agregan aqui a medida que se implementan.
];

export const VERSION_ACTUAL: Release = RELEASES[RELEASES.length - 1];

