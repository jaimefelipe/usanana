export interface Prospecto {
  Id_Persona: number;
  Nombre: string;
  Correo: string;
  Telefono: string;
  Estado_Prospeccion: 'P1'|'P2'|'P3'|'P4'|'P5'|'P6'|'P7'|'P8'|'P9';
  Creado_EL: string;
}