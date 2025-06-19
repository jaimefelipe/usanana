import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

constructor(
  private apiService:ApiService
) { }

   async empleadoExiste(Id_Persona) {
    let sqlConfig = {
      table: 'Rhh_Empleado',
      fields: 'Id_Empleado',
      where: 'Id_Persona ='+Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async crearEmpleado(Id_Persona){
    let sql = {
      table: 'Rhh_Empleado',
      fields: 'Id_Persona',
      values: '\'' + Id_Persona
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async leerEmpleados(){
    let sqlConfig = {
      table: 'Rhh_Empleado inner Join Gen_Persona On Gen_Persona.Id_Persona = Rhh_Empleado.Id_Persona',
      fields: 'Id_Empleado,Nombre'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
