import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  constructor(private apiService: ApiService) {}

  async loadCajas(paginacion,search?) {
    let sqlConfig = {
      table: 'Ven_Caja Inner Join Gen_Sucursal on Ven_Caja.Id_Sucursal = Gen_Sucursal.Id_Sucursal',
      fields: 'Id_Caja,Ven_Caja.Id_Sucursal,Numero_Caja,Consecutivo,Saldo_Apertura,Saldo_Actual,Id_Cajero,Ven_Caja.Estado,Gen_Sucursal.Nombre,Id_Caja_Diaria',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCaja(Id_Caja){
    let sqlConfig = {
      table: 'Ven_Caja left Join Seg_Usuario on Ven_Caja.Id_Cajero = Seg_Usuario.Id_Usuario',
      fields: 'Id_Caja,Id_Sucursal,Numero_Caja,Consecutivo,Saldo_Apertura,Saldo_Actual,Id_Cajero,Ven_Caja.Estado,Nombre_Usuario,Id_Caja_Diaria',
      orderField: '',
      searchField: '',
      where: "Id_Caja = " + Id_Caja
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveCaja(Caja){
    if(Caja.Saldo_Apertura == ''){
      Caja.Saldo_Apertura = 0;
    }
    if(Caja.Saldo_Actual == ''){
      Caja.Saldo_Actual = 0;
    }
    if(Caja.Consecutivo == ''){
      Caja.Consecutivo = 1;
    }
    //Validar que el Nombre de la Caja no Exista.
    let sql = "Select Id_Caja from Ven_Caja where Id_Sucursal=" + Caja.Id_Sucursal + " and Numero_Caja = '" + Caja.Numero_Caja + "' and Id_Caja !="+ Caja.Id_Caja;
    let data = await this.apiService.postRecord(sql);

    if (data["total"] === 0) {
      if(Caja.Id_Caja ==""){
        let sql = {
          table: 'Ven_Caja',
          fields: 'Id_Sucursal,Numero_Caja,Consecutivo,Saldo_Apertura,Saldo_Actual,Id_Cajero,Estado',
          values: '\'' + Caja.Id_Sucursal
          + '\',\'' + Caja.Numero_Caja
          + '\',\'' + Caja.Consecutivo
          + '\',\'' + Caja.Saldo_Apertura
          + '\',\'' + Caja.Saldo_Actual
          + '\',\'' + Caja.Id_Cajero
          + '\',\'' + Caja.Estado + '\''
        };
        return await this.apiService.insertRecord(sql);
      }else{
        let sql = {
          table: 'Ven_Caja',
          fields: 'Id_Sucursal=\'' + Caja.Id_Sucursal
          + '\',Numero_Caja=\'' + Caja.Numero_Caja
          + '\',Consecutivo=\'' + Caja.Consecutivo
          + '\',Saldo_Apertura=\'' + Caja.Saldo_Apertura
          + '\',Saldo_Actual=\'' + Caja.Saldo_Actual
          + '\',Id_Cajero=\'' + Caja.Id_Cajero
          + '\',Estado=\''+ Caja.Estado  + '\'',
          where: 'Id_Caja=' + Caja.Id_Caja
        };
        return await this.apiService.updateRecord(sql);
      }
    }else{
      return false;
    }
  }
  async cerrarCaja(id_Caja){
    let sql = 'Update Ven_Caja Set Estado = 0, Id_Cajero = NULL where Id_Caja = ' + id_Caja;
    return await this.apiService.postRecord(sql);
  }
  async abrirCaja(Caja,Cajero,Id_Caja_Diaria){
    let sql = 'Update Ven_Caja Set Estado = 1, Saldo_Apertura = ' + Caja.Saldo_Apertura +',Saldo_Actual = '+ Caja.Saldo_Apertura +', Id_Cajero = ' + Cajero + ',Id_Caja_Diaria='+Id_Caja_Diaria+' where Id_Caja = ' + Caja.Id_Caja;
    return await this.apiService.postRecord(sql);
  }
  async ActualizarSaldo(Id_Caja,Saldo){
    let sql = 'Update Ven_Caja Set Saldo_Actual = '+ Saldo +' where Id_Caja = ' + Id_Caja;
    return await this.apiService.postRecord(sql);
  }
  async GenerarCierreCaja(Caja){
    let sql = {
      table: 'Ven_Cierre_Caja',
      fields: 'Id_Sucursal,Numero_Caja,Cincuentamil,Veintemil,Diezmil,Cincomil,Dosmil,Mil,Quinientos,Cien,Cincuenta,Veinticinco,Diez,Cinco,CienDolares,CincuentaDolares,VeinteDolares,DiezDolares,CincoDolares,DosDolares,UnDolare,Varios,Sinpe,Deposito,DatafonoColones,DatafonoDolares,Id_Caja_Diaria',
      values: '\'' + Caja.Id_Sucursal
      + '\',\'' + Caja.Id_Caja
      + '\',\'' + Caja.Cincuentamil
      + '\',\'' + Caja.Veintemil
      + '\',\'' + Caja.Diezmil
      + '\',\'' + Caja.Cincomil
      + '\',\'' + Caja.Dosmil
      + '\',\'' + Caja.Mil
      + '\',\'' + Caja.Quinientos
      + '\',\'' + Caja.Cien
      + '\',\'' + Caja.Cincuenta
      + '\',\'' + Caja.Veinticinco
      + '\',\'' + Caja.Diez
      + '\',\'' + Caja.Cinco
      + '\',\'' + Caja.CienDolares
      + '\',\'' + Caja.CincuentaDolares
      + '\',\'' + Caja.VeinteDolares
      + '\',\'' + Caja.DiezDolares
      + '\',\'' + Caja.CincoDolares
      + '\',\'' + Caja.DosDolares
      + '\',\'' + Caja.UnDolar
      + '\',\'' + Caja.Varios
      + '\',\'' + Caja.Sinpe
      + '\',\'' + Caja.Deposito
      + '\',\'' + Caja.DatafonoColones
      + '\',\'' + Caja.DatafonoDolares
      + '\',\'' + Caja.Id_Caja_Diaria
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async loadSucursales(paginacion,search?) {
    let sqlConfig = {
      table: 'Gen_Sucursal',
      fields: 'Id_Sucursal,Nombre',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async crearRegistroDiario(Caja){
    let sqlMovement = {
      table: 'Ven_Caja_Diaria',
      fields: 'Id_Caja,Id_Usuario,Saldo_Apertura,Estado',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Caja.Id_Caja
      + '\',\'' + Caja.Id_Usuario
      + '\',\'' + Caja.Saldo_Apertura
      + '\',\'' + Caja.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sqlMovement);
  }

  async CargarCierre(Id_Caja,Inicio,Fin) {
    let Fecha_Inicio = "DATE_FORMAT(STR_TO_DATE(CONCAT('"+Inicio+"',' 00:00:00'), '%d/%m/%Y %H:%i:%s'),'%Y-%m-%d %H:%i:%s')";
    let Fecha_Fin = "DATE_FORMAT(STR_TO_DATE(CONCAT('"+Fin+"',' 23:59:59'), '%d/%m/%Y %H:%i:%s'),'%Y-%m-%d %H:%i:%s')";
    let where = ''
    if(Id_Caja== '99'){
      where = ''
    }else{
      where = 'Id_Caja ='+ Id_Caja + " and "
    }
    where = where + ' Creado_El >='+Fecha_Inicio+' and Creado_El <='+Fecha_Fin
    let sqlConfig = {
      table: 'Ven_Caja_Diaria',
      fields: 'Id_Caja_Diaria',
      where: where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerCajaDiaria(Id_Caja_Diaria){
    let sqlConfig = {
      table: 'Ven_Caja_Diaria',
      fields: 'Creado_El',
      where:'Id_Caja_Diaria = ' + Id_Caja_Diaria
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerCierreDeCaja(Id_Caja){
    let sqlConfig = {
      table: 'Ven_Caja',
      fields: 'Id_Caja_Diaria',
      where:'Id_Caja = ' + Id_Caja
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async CerrarCierreDiario(Id_Caja_Diaria){
    let sql = 'Update Ven_Caja_Diaria Set Cerrado_Por = '+ localStorage.getItem('Nombre_Usuario') +',Cerrado_El = Now() where Id_Caja_Diaria = ' + Id_Caja_Diaria;
    return await this.apiService.postRecord(sql);
  }
}
