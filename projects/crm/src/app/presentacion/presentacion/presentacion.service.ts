import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {

  constructor(
    private apiService:ApiService
  ) { }

  async LeerBloqueA() {
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre',
      orderField: 'Nombre',
      orderDirection: ' ASC',
      where: 'Declaracion = 1 and PresentacionA = 1 and Presentado = 0'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerBloqueB() {
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre',
      orderField: 'Nombre',
      orderDirection: ' ASC',
      where: 'Declaracion = 1 and PresentacionB = 1 and Presentado = 0'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerPresentado() {
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre',
      orderField: 'Nombre',
      orderDirection: ' ASC',
      where: 'Declaracion = 1 and Presentado = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async PonerTerminado(Id_Persona){
    let sql = {
      table: 'Gen_Persona',
      fields: 'Presentado=\'1\'',
      where: 'Id_Persona=' + Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }
  async PonerPendiente(Id_Persona){
    let sql = {
      table: 'Gen_Persona',
      fields: 'Presentado=\'0\'',
      where: 'Id_Persona=' + Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }
}
