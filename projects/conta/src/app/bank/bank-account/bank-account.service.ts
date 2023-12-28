import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private apiService:ApiService) { }
  async loadAccounts(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Ban_Cuenta',
      fields: 'Id_Cuenta,Cuenta,Nombre,Estado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadAccount(Id_Cuenta) {
    let sqlConfig = {
      table: 'Ban_Cuenta',
      fields: 'Id_Cuenta,Cuenta,Nombre,Emisor,IBAN,Moneda,Cuenta_Contable,Saldo,Estado',
      where:'Id_Cuenta ='+ Id_Cuenta
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async insertAccount(Account){
    let sql = {
      table: 'Ban_Cuenta',
      fields: 'Cuenta,Nombre,Moneda,Cuenta_Contable,Emisor,IBAN,Estado',
      values: '\'' + Account.Cuenta
      + '\',\'' + Account.Nombre
      + '\',\'' + Account.Moneda
      + '\',\'' + Account.Cuenta_Contable
      + '\',\'' + Account.Emisor
      + '\',\'' + Account.IBAN
      + '\',\'' + Account.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateAccount(Cuenta){
    let sql = {
      table: 'Ban_Cuenta',
      fields: 'Cuenta=\'' + Cuenta.Cuenta
      + '\',Nombre=\'' + Cuenta.Nombre
      + '\',Moneda=\'' + Cuenta.Moneda
      + '\',Cuenta_Contable=\''+ Cuenta.Cuenta_Contable
      + '\',Estado=\''+ Cuenta.Estado
      + '\',Emisor=\''+ Cuenta.Emisor
      + '\'',
      where: 'Id_Cuenta=' + Cuenta.Id_Cuenta
    };
    return await this.apiService.updateRecord(sql);
  }

}
