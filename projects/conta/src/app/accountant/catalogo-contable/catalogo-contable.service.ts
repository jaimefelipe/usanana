import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoContableService {

  constructor(private apiService: ApiService) {}

  async loadCatalogo(){
    return await fetch(
      'https://toxo.work/reportes/contabilidad/cge_catalgo_contable.php?sql=' + localStorage.getItem('Id_Empresa'))
      .then((response) => {
        if (!response.ok) {
          return JSON.parse('{success: "false",total: "0", eror:"Error desconocido"}');
          //throw new Error('HTTP error ' + response.status);
        }else{}
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        return JSON.parse('{success: "false",total: "0", eror:"error en catch"}');
      });
  }

  async loadAccountants(paginacion,search?) {
    let sqlConfig = {
      table: 'Cge_Cuenta_Contable',
      fields: "CONCAT('A',CUENTA) AS ALPA,Id_Cuenta_Contable,Cuenta,Padre,Balance,Descripcion,Deudora,Estado,Mayor",
      orderField: 'ALPA',
      orderDirection:' ASC ',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadChildsOf(paginacion,search?,Cuenta?) {
    if(!Cuenta){
      Cuenta = "''";
    }
    let sqlConfig = {
      table: 'Cge_Cuenta_Contable',
      fields: 'Id_Cuenta_Contable,Cuenta,Balance,Descripcion,Deudora,Estado',
      orderField: 'Cuenta',
      orderDirection:'ASC',
      searchField: search,
      paginacion: paginacion,
      where:'Padre = '+ Cuenta
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadParents(paginacion,search?,Mayor?) {
    let mayor = 1;
    if(Mayor===0){
      mayor = 0;
    }
    let sqlConfig = {
      table: 'Cge_Cuenta_Contable',
      fields: 'Id_Cuenta_Contable,Cuenta,Balance,Descripcion,Deudora,Estado',
      orderField: 'Cuenta',
      orderDirection:'ASC',
      searchField: search,
      paginacion: paginacion,
      where:'Mayor = '+ mayor
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadAccount(Id_Cuenta_Contable){
    let sqlConfig = {
      table: 'Cge_Cuenta_Contable',
      fields: 'Id_Cuenta_Contable,Cuenta,Padre,Descripcion,Mayor,Deudora,Estado,Centro_Costo,D151,Balance,Moneda',
      where:'Id_Cuenta_Contable='+Id_Cuenta_Contable
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadAccountFromCode(Cuenta,Mayor?){
    let mayor = '';
    if(Mayor==1 || Mayor ==0){
      mayor = ' and Mayor = '+ Mayor ;
    }
    let sqlConfig = {
      table: 'Cge_Cuenta_Contable',
      fields: 'Id_Cuenta_Contable,Cuenta,Padre,Descripcion,Mayor,Deudora,Estado,Centro_Costo,D151,Balance,Moneda',
      where:"Cuenta='"+Cuenta+"'"+mayor
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadAccountLike(Cuenta,Mayor?){
    let mayor = '';
    if(Mayor==1 || Mayor ==0){
      mayor = ' and Mayor = '+ Mayor ;
    }
    let sqlConfig = {
      table: 'Cge_Cuenta_Contable',
      fields: 'Id_Cuenta_Contable,Cuenta,Padre,Descripcion,Mayor,Deudora,Estado,Centro_Costo,D151,Balance,Moneda',
      where:"(Cuenta like '---"+Cuenta+"---' or Descripcion like '---"+Cuenta+"---') "+mayor
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveAccount(Account){
    if(Account.Padre == "undefined"){
      Account.Padre = '';
    }
    if(Account.Id_Cuenta_Contable ==""){
      // Verificar si la cuenta existe
      let sqlConfig = {
        table: 'Cge_Cuenta_Contable',
        fields: 'Id_Cuenta_Contable',
        where:'Cuenta='+Account.Cuenta
      }
      let cuenta =  await this.apiService.executeSqlSyn(sqlConfig);
      if(cuenta['total']==0){
        let sql = {
          table: 'Cge_Cuenta_Contable',
          fields: 'Cuenta,Padre,Descripcion,Mayor,Deudora,Estado,Centro_Costo,D151,Balance,Moneda',
          values: '\'' + Account.Cuenta
          + '\',\'' + Account.Padre
          + '\',\'' + Account.Descripcion
          + '\',\'' + Account.Mayor
          + '\',\'' + Account.Deudora
          + '\',\'' + Account.Estado
          + '\',\'' + Account.Centro_Costo
          + '\',\'' + Account.D151
          + '\',\'' + Account.Balance
          + '\',\'' + Account.Moneda + '\''
        };
        return await this.apiService.insertRecord(sql);
      }else{
        Swal.fire('Error, Cuenta ya Existe');
      }
    }else{
      let sql = {
        table: 'Cge_Cuenta_Contable',
        fields: 'Cuenta=\'' + Account.Cuenta
        + '\',Padre=\'' + Account.Padre
        + '\',Descripcion=\'' + Account.Descripcion
        + '\',Mayor=\'' + Account.Mayor
        + '\',Deudora=\'' + Account.Deudora
        + '\',Estado=\'' + Account.Estado
        + '\',Centro_Costo=\'' + Account.Centro_Costo
        + '\',D151=\'' + Account.D151
        + '\',Balance=\'' + Account.Balance
        + '\',Moneda=\''+ Account.Moneda  + '\'',
        where: 'Id_Cuenta_Contable=' + Account.Id_Cuenta_Contable
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async ActualizarHIjos(Old,New){
    let sql = {
      table: 'Cge_Cuenta_Contable',
      fields: 'Padre=\'' + New + '\'',
      where: 'Id_Empresa = '+localStorage.getItem('Id_Empresa')+' and Padre=' + Old
    };
    return await this.apiService.updateRecord(sql);
  }
  async LeerCuentasUsadas(Cuenta){
    let sqlConfig = {
      table: 'Cge_Asiento_Contable_Detalle',
      fields: "Id_Asiento_Contable_Detalle",
      where:'Cuenta='+Cuenta
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
