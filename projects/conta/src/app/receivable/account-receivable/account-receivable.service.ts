import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountReceivableService {

  constructor(private apiService: ApiService) {}

  async loadCentas(paginacion,search?) {
    let sqlConfig = {
      table: 'Cxc_Cuenta',
      fields: 'Id_Cuenta,Nombre,Moneda,Estado,Saldo,Plazo',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCuenta(Id_Cuenta){
    let sqlConfig = {
      table: 'Cxc_Cuenta',
      fields: 'Id_Cuenta,Id_Clasificacion,Id_Cliente,Nombre,Moneda,Plazo,Credito,Saldo,Dia_Tramite,Hora_Tramite,Dia_Pago,Hora_Pago,Lugar_Pago,Notas,Estado',
      orderField: '',
      searchField: '',
      where: "Id_Cuenta = " + Id_Cuenta
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveCuenta(Cuenta){
    if(Cuenta.Id_Cuenta ==""){
      let sql = {
        table: 'Cxc_Cuenta',
        fields: 'Nombre,Plazo,Moneda,Id_Clasificacion,Estado',
        values: '\'' + Cuenta.Nombre
        + '\',\'' + Cuenta.Plazo
        + '\',\'' + Cuenta.Moneda
        + '\',\'' + Cuenta.Id_Clasificacion
        + '\',\'' + Cuenta.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Cxc_Cuenta',
        fields: 'Nombre=\'' + Cuenta.Nombre
        + '\',Plazo=\'' + Cuenta.Plazo
        + '\',Moneda=\'' + Cuenta.Moneda
        + '\',Id_Clasificacion=\'' + Cuenta.Id_Clasificacion
        + '\',Estado=\''+ Cuenta.Estado  + '\'',
        where: 'Id_Cuenta=' + Cuenta.Id_Cuenta
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
