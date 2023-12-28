import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class BankMovementService {

  constructor(private apiService:ApiService) { }
  async loadMovements(paginacion,search?) {
    let sqlConfig = {
      table: 'Ban_Movimiento',
      fields: 'Id_Movimiento,Id_Cuenta,Tipo_Movimiento,Documento,Fecha,Monto,Estado',
      searchField: search,
      paginacion: paginacion,
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveMovement(Movement){
    let sql = {
      table: 'Ban_Movimiento',
      fields: 'Id_Cuenta,Tipo_Movimiento,Documento,Descripcion,Fecha,Estado,Monto',
      values: '\'' + Movement.Id_Cuenta
      + '\',\'' + Movement.Tipo_Movimiento
      + '\',\'' + Movement.Documento
      + '\',\'' + Movement.Descripcion
      + '\',\'' + Movement.Fecha
      + '\',\'' + Movement.Estado
      + '\',\'' + Movement.Monto
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateMovement(Movement){
    let sql = {
      table: 'Ban_Movimiento',
      fields: 'Id_Cuenta=\'' + Movement.Id_Cuenta
      + '\',Tipo_Movimiento=\'' + Movement.Tipo_Movimiento
      + '\',Documento=\'' + Movement.Documento
      + '\',Descripcion=\''+ Movement.Descripcion
      + '\',Fecha=\''+ Movement.Fecha
      + '\',Estado=\''+ Movement.Estado
      + '\',Monto=\''+ Movement.Monto
      + '\'',
      where: 'Id_Movimiento=' + Movement.Id_Movimiento
    };
    return await this.apiService.updateRecord(sql);
  }
}
