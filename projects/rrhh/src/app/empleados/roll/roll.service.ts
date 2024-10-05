import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RollService {

  constructor(private apiService: ApiService) {}
  async loadRolles(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Rhh_Roll',
      fields: 'Id_Roll,Nombre,Inicio_Lunes,Fin_Lunes',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadRoll(Id_Roll) {
    let sqlConfig = {
      table: 'Rhh_Roll',
      fields: 'Id_Roll,Codigo,Nombre,Lunes,Inicio_Lunes,Fin_Lunes,Martes,Inicio_Martes,Fin_Martes,Miercoles,Inicio_Miercoles,Fin_Miercoles,Jueves,Inicio_Jueves,Fin_Jueves,Viernes,Inicio_Viernes,Fin_Viernes,Sabado,Inicio_Sabado,Fin_Sabado,Domingo,Inicio_Domingo,Fin_Domingo,Estado',
      where: 'Id_Roll='+Id_Roll
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveRoll(Roll){
    if(Roll.Id_Roll == ""){
      let sql = {
        table: 'Rhh_Roll',
        fields: 'Codigo,Nombre,Lunes,Inicio_Lunes,Fin_Lunes,Martes,Inicio_Martes,Fin_Martes,Miercoles,Inicio_Miercoles,Fin_Miercoles,Jueves,Inicio_Jueves,Fin_Jueves,Viernes,Inicio_Viernes,Fin_Viernes,Sabado,Inicio_Sabado,Fin_Sabado,Domingo,Inicio_Domingo,Fin_Domingo,Estado',
        values: '\'' + Roll.Codigo
        + '\',\'' + Roll.Nombre
        + '\',\'' + Roll.Lunes
        + '\',\'' + Roll.Inicio_Lunes
        + '\',\'' + Roll.Fin_Lunes
        + '\',\'' + Roll.Martes
        + '\',\'' + Roll.Inicio_Martes
        + '\',\'' + Roll.Fin_Martes
        + '\',\'' + Roll.Miercoles
        + '\',\'' + Roll.Inicio_Miercoles
        + '\',\'' + Roll.Fin_Miercoles
        + '\',\'' + Roll.Jueves
        + '\',\'' + Roll.Inicio_Jueves
        + '\',\'' + Roll.Fin_Jueves
        + '\',\'' + Roll.Viernes
        + '\',\'' + Roll.Inicio_Viernes
        + '\',\'' + Roll.Fin_Viernes
        + '\',\'' + Roll.Sabado
        + '\',\'' + Roll.Inicio_Sabado
        + '\',\'' + Roll.Fin_Sabado
        + '\',\'' + Roll.Domingo
        + '\',\'' + Roll.Inicio_Domingo
        + '\',\'' + Roll.Fin_Domingo
        + '\',\'' + Roll.Estado
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Rhh_Roll',
        fields: 'Codigo=\'' + Roll.Codigo
        + '\',Nombre=\''+ Roll.Nombre
        + '\',Lunes=\''+ Roll.Lunes
        + '\',Inicio_Lunes=\''+ Roll.Inicio_Lunes
        + '\',Fin_Lunes=\''+ Roll.Fin_Lunes
        + '\',Martes=\''+ Roll.Martes
        + '\',Inicio_Martes=\''+ Roll.Inicio_Martes
        + '\',Fin_Martes=\''+ Roll.Fin_Martes
        + '\',Miercoles=\''+ Roll.Miercoles
        + '\',Inicio_Miercoles=\''+ Roll.Inicio_Miercoles
        + '\',Fin_Miercoles=\''+ Roll.Fin_Miercoles
        + '\',Jueves=\''+ Roll.Jueves
        + '\',Inicio_Jueves=\''+ Roll.Inicio_Jueves
        + '\',Fin_Jueves=\''+ Roll.Fin_Jueves
        + '\',Viernes=\''+ Roll.Viernes
        + '\',Inicio_Viernes=\''+ Roll.Inicio_Viernes
        + '\',Fin_Viernes=\''+ Roll.Fin_Viernes
        + '\',Sabado=\''+ Roll.Sabado
        + '\',Inicio_Sabado=\''+ Roll.Inicio_Sabado
        + '\',Fin_Sabado=\''+ Roll.Fin_Sabado
        + '\',Domingo=\''+ Roll.Domingo
        + '\',Inicio_Domingo=\''+ Roll.Inicio_Domingo
        + '\',Fin_Domingo=\''+ Roll.Fin_Domingo
        + '\',Estado=\''+ Roll.Estado
         + '\'', 
        where: 'Id_Roll=' + Roll.Id_Roll
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
