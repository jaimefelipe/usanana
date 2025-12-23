import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadSemanaService {

constructor(private apiService:ApiService) { }

async getActividades(Id_Semana: number) {
    const config = {
      table: 'Lms_Actividad',
      fields: 'Id_Actividad, Id_Semana, Nombre, Instrucciones, Fecha_Limite, Tipo,Puntaje, URL, Estado',
      where: 'Id_Semana = ' + Id_Semana,
       orderDirection: ' ASC ',
      simple: true
    };
    return await this.apiService.executeSqlSyn(config);
  }

  async actualizarActividad(actividad: any){
    if (actividad.Id_Actividad) {
      const updateConfig = {
        table: 'Lms_Actividad',
        fields: `Nombre='${actividad.Nombre}', Instrucciones='${actividad.Instrucciones}', Fecha_Limite='${actividad.Fecha_Limite}', Tipo='${actividad.Tipo}',Puntaje='${actividad.Puntaje}', URL='${actividad.URL}', Estado='1'`,
        where: 'Id_Actividad=' + actividad.Id_Actividad
      };
      return await this.apiService.updateRecord(updateConfig);
    }
  }
  async crearActividad(actividad: any) {
    const config = {
      table: 'Lms_Actividad',
      fields: 'Id_Semana, Nombre, Instrucciones, Fecha_Limite, Tipo,Puntaje, URL, Estado',
      values: `'${actividad.Id_Semana}', '${actividad.Nombre}', '${actividad.Instrucciones}', '${actividad.Fecha_Limite}', '${actividad.Tipo}', '${actividad.Puntaje}', '${actividad.URL}', '1'`
    };
    return await this.apiService.insertRecord(config);
  }

  async eliminarActividad(Id_Actividad: number) {
    const updateConfig = {
        table: 'Lms_Actividad',
        fields: `Estado='0'`,
        where: 'Id_Actividad=' + Id_Actividad
      };
      return await this.apiService.updateRecord(updateConfig);
  }
  async subirArchivo(file){
    return await this.apiService.loadPublicFile(file);
  }
  
  //Generar Foto para la semana y el grupo
  async InsertarFoto(Foro){
    let sql = {
      table: 'Lms_Foro',
      fields: ' Id_Actividad,Id_Semana,Id_Grupo,Titulo,Descripcion',
      values: '\'' + Foro.Id_Actividad
      + '\',\'' + Foro.Id_Semana
      + '\',\'' + Foro.Id_Grupo
      + '\',\'' + Foro.Titulo
      + '\',\'' + Foro.Descripcion +  '\''
    };
    return await this.apiService.insertRecord(sql);
  }


}
