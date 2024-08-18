import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private apiService:ApiService) { }
  
  async leerTareas(paginacion,search?,Id_Persona?,Fecha?) {
    let where = 'Gen_Tarea.Estado != 5';
    if(Id_Persona){
      if(Id_Persona != ''){
        where = where + ' and Id_Beneficiario = ' + Id_Persona;
      }
    }
    if(Fecha == 1){
      where = where + ' and Inicio = CURDATE()';
    }
    if(Fecha == 2){
      where = where + ' and Inicio = DATE_ADD(CURDATE(), INTERVAL 1 DAY)';
    }
    if(Fecha == 3){
      where = where + ' and Inicio > DATE_ADD(CURDATE(), INTERVAL 1 DAY) or Inicio = "0000-00-00 00:00:00"';
    }
    if(Fecha == 4){
      where = where + ' and Inicio < CURDATE() and Inicio != "0000-00-00 00:00:00"';
    }

    let sqlConfig = {
      table: 'Gen_Tarea inner join Gen_Persona on Gen_Tarea.Id_Beneficiario = Gen_Persona.Id_Persona and Gen_Persona.Id_Empresa = Gen_Tarea.Id_Empresa left join Gen_Persona as Encargado on Gen_Tarea.Id_Encargado = Encargado.Id_Persona  and Encargado.Id_Empresa = Gen_Tarea.Id_Empresa Left join Gen_Persona as Asistente on Gen_Tarea.Id_Asistente = Asistente.Id_Persona and Asistente.Id_Empresa = Gen_Tarea.Id_Empresa Left join Gen_Persona as Supervisor on Gen_Tarea.Id_Supervisor = Supervisor.Id_Persona and Supervisor.Id_Empresa = Gen_Tarea.Id_Empresa',
      fields: 'Id_Tarea,Id_Beneficiario,Id_Encargado,Id_Asistente,Id_Supervisor,Tipo,Gen_Tarea.Estado,Avance,Tarea,Inicio,Fin,Gen_Persona.Nombre as NombreBeneficiario, Encargado.Nombre as NombreEncargado, Asistente.Nombre as NombreAsistente, Supervisor.Nombre as NombreSupervisor',
      searchField: search,
      paginacion: paginacion,
      where: where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerTarea(Id_Tarea) {
    let sqlConfig = {
      table: 'Gen_Tarea inner join Gen_Persona on Gen_Tarea.Id_Beneficiario = Gen_Persona.Id_Persona',
      fields: 'Id_Tarea,Id_Beneficiario,Id_Encargado,Id_Asistente,Id_Supervisor,Tipo,Estado,Avance,Tarea,Inicio,Fin,Gen_Persona.Nombre',
      where: 'Id_Tarea='+Id_Tarea
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async nuevaTarea(Tarea){
    let sql = {
      table: 'Gen_Tarea',
      fields: 'Id_Beneficiario,Id_Encargado,Id_Asistente,Id_Supervisor,Tipo,Estado,Avance,Tarea,Inicio,Fin',
      values: '\'' + Tarea.Id_Beneficiario
      + '\',\'' + Tarea.Id_Encargado
      + '\',\'' + Tarea.Id_Asistente
      + '\',\'' + Tarea.Id_Supervisor
      + '\',\'' + Tarea.Tipo
      + '\',\'' + Tarea.Estado
      + '\',\'' + Tarea.Avance
      + '\',\'' + Tarea.Tarea
      + '\',\'' + Tarea.Inicio
      + '\',\'' + Tarea.Fin
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async actualizarTarea(Tarea){
    let sql = {
      table: 'Gen_Tarea',
      fields: 'Id_Beneficiario=\'' + Tarea.Id_Beneficiario
      + '\',' + 'Id_Encargado=\'' + Tarea.Id_Encargado
      + '\',' + 'Id_Asistente=\'' + Tarea.Id_Asistente
      + '\',' + 'Id_Supervisor=\'' + Tarea.Id_Supervisor
      + '\',' + 'Tipo=\'' + Tarea.Tipo
      + '\',' + 'Estado=\'' + Tarea.Estado
      + '\',' + 'Avance=\'' + Tarea.Avance
      + '\',' + 'Tarea=\'' + Tarea.Tarea
      + '\',' + 'Inicio=\'' + Tarea.Inicio
      + '\',' + 'Fin=\'' + Tarea.Fin
      + '\'',
      where: 'Id_Tarea=' + Tarea.Id_Tarea
    };
    return await this.apiService.updateRecord(sql);
  }

}
