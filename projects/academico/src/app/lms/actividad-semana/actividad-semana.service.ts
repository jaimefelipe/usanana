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
      simple: true
    };
    return await this.apiService.executeSqlSyn(config);
  }

  async actualizarActividad(actividad: any){
    if (actividad.Id_Actividad) {
      const updateConfig = {
        table: 'Lms_Actividad',
        fields: `Nombre='${actividad.Nombre}', Instrucciones='${actividad.Instrucciones}', Fecha_Limite='${actividad.Fecha_Limite}', Tipo='${actividad.Tipo}',Puntaje='${actividad.Puntaje}', URL='${actividad.URL}', Estado='${actividad.Estado}'`,
        where: 'Id_Actividad=' + actividad.Id_Actividad
      };
      return await this.apiService.updateRecord(updateConfig);
    }
  }
  async crearActividad(actividad: any) {
    const config = {
      table: 'Lms_Actividad',
      fields: 'Id_Semana, Nombre, Instrucciones, Fecha_Limite, Tipo,Puntaje, URL, Estado',
      values: `'${actividad.Id_Semana}', '${actividad.Nombre}', '${actividad.Instrucciones}', '${actividad.Fecha_Limite}', '${actividad.Tipo}', '${actividad.Puntaje}', '${actividad.URL}', '${actividad.Estado}'`
    };
    return await this.apiService.insertRecord(config);
  }

  async eliminarActividad(Id_Actividad: number) {
    //return await this.apiService.deleteRecord('Edu_Actividad_Semana', 'Id_Actividad=' + Id_Actividad);
  }
  async subirArchivo(file){
    return await this.apiService.loadPublicFile(file);
  }
  
}
