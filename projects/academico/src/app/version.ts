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
    titulo: 'Base operativa academica',
    modulo: 'General',
    cambios: [
      'Dashboard academico con accesos rapidos e indicadores operativos',
      'Registro academico, matricula, aula virtual y vista de profesor integradas',
      'Campus comparte identidad de usuario con Seguridad'
    ]
  },
  {
    version: '1.0.1',
    fecha: '2026-08-12',
    titulo: 'Version visible, novedades y control de matricula',
    modulo: 'General',
    cambios: [
      'Academico muestra la version ejecutada y una vista de novedades para usuarios',
      'La creacion de usuarios valida la asociacion correcta entre usuario y empresa para evitar accesos fallidos en Campus',
      'Matricula bloquea cursos aprobados o convalidados, permite repetir cursos reprobados o cerrados y permite cambiar de grupo'
    ]
  },
  {
    version: '1.0.2',
    fecha: '2026-08-17',
    titulo: 'Niveles y escuelas sincronizados con carreras',
    modulo: 'Configuracion',
    cambios: [
      'Se agregan mantenimientos de niveles academicos y escuelas en Configuracion',
      'Carreras carga niveles y escuelas desde catalogos administrables, filtrando escuelas por facultad',
      'El formulario de carrera valida facultad y escuela antes de guardar para evitar relaciones incompletas'
    ]
  },
  {
    version: '1.0.3',
    fecha: '2026-09-03',
    titulo: 'Carga inicial mas liviana',
    modulo: 'Rendimiento',
    cambios: [
      'La carga inicial de Academico baja de 6.77 MB a cerca de 1.5 MB',
      'Aula Virtual (editor de contenido con Syncfusion) ahora se descarga solo al entrar ahi, no en cada pantalla de Academico'
    ]
  },
  {
    version: '1.0.4',
    fecha: '2026-09-09',
    titulo: 'Fix critico: busqueda de Aula Virtual',
    modulo: 'Aula Virtual',
    cambios: [
      'Corregido que la busqueda en Configuracion de Aula Virtual a veces mostraba el listado completo sin filtrar aunque la busqueda si encontraba resultados correctos',
      'Corregido que la pantalla podia quedar trabada en "Cargando..." para siempre si la consulta fallaba por una conexion lenta'
    ]
  },
  {
    version: '1.0.5',
    fecha: '2026-09-09',
    titulo: 'Fix adicional: pantalla de Aula Virtual no se limpiaba en conexiones lentas',
    modulo: 'Aula Virtual',
    cambios: [
      'La busqueda ya no depende de perder el foco del campo (blur), solo de Enter o del boton de buscar, para evitar que una misma busqueda se disparara dos veces en conexiones lentas',
      'El listado se limpia de inmediato al iniciar una busqueda nueva, para que nunca se vea el listado anterior mezclado con el de "Cargando..."',
      'Se agrego un tope duro de tiempo para que la pantalla nunca quede pegada en "Cargando..." aunque la conexion se cuelgue por completo'
    ]
  }
];

export const VERSION_ACTUAL: Release = RELEASES[RELEASES.length - 1];
