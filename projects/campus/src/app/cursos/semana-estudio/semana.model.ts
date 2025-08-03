export interface ItemSemana {
  Id: number;
  Tipo: 'video' | 'lectura' | 'foro' | 'tarea';
  Titulo: string;
  Contenido: string;
  [key: string]: any;
}

export interface Semana {
  Id_Semana: number;
  Titulo: string;
  Recursos: ItemSemana[];
  Actividades: ItemSemana[];
}