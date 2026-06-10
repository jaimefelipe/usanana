import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class ActividadAlumnoService {

constructor(
  private apiService:ApiService
) { }
  async subirArchivo(file){
      return await this.apiService.loadPublicFile(file);
    }
  async guardarParticipacion(actividad){
    let sql = {
      table: 'Lms_EntregaActividad',
      fields: 'Id_Actividad,Id_Usuario,Url',
      values: '\'' + actividad.Id_Actividad
      + '\',\'' + localStorage.getItem('Id_Usuario')
      + '\',\'' + actividad.Url + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async obtenerParticipaciones(Id_Actividad){
    let sqlConfig = {
      table: 'Lms_EntregaActividad',
      fields: 'Url,Nota,Comentario_Docente',
      where: 'Id_Actividad = ' + Id_Actividad + ' and Id_Usuario = ' + localStorage.getItem('Id_Usuario')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
