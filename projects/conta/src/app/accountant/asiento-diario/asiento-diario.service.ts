import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class AsientoDiarioService {

  constructor(private apiService: ApiService) {}

  async loadAsientos(paginacion:any,search?:any) {
    let sqlConfig = {
      table: 'Cge_Asiento_Contable_Encabezado inner join Cge_Periodo_Contable on Cge_Asiento_Contable_Encabezado.Id_Periodo = Cge_Periodo_Contable.Id_Periodo_Contable',
      fields: 'Id_Asiento_Contable_Encabezado,Fecha,Documento,Sistema_Origen,Cge_Asiento_Contable_Encabezado.Descripcion,Cge_Asiento_Contable_Encabezado.Estado,Diferencia,Id_Periodo,Mes,Anio,Secuencia',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadAsientoDiarioEncabezado(Id_Asiento_Contable_Encabezado:any) {
    let sqlConfig = {
      table: 'Cge_Asiento_Contable_Encabezado',
      fields: 'Id_Asiento_Contable_Encabezado,Descripcion,Documento,Tipo_Cambio,Registro_Origen,Sistema_Origen,Id_Periodo,Fecha,Debitos,Creditos,Diferencia,Estado',
      where: 'Id_Asiento_Contable_Encabezado='+Id_Asiento_Contable_Encabezado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadAsientoDiarioDetalle(Id_Asiento_Contable_Encabezado:any) {
    let sqlConfig = {
      table: 'Cge_Asiento_Contable_Detalle',
      fields: 'Id_Asiento_Contable_Detalle,Cuenta,Moneda,Detalle_Cuenta,Documento,Debe,Haber,Debe_Me,Haber_Me',
      where: 'Id_Asiento_Contable_Encabezado='+Id_Asiento_Contable_Encabezado,
      orderField: 'Id_Asiento_Contable_Detalle',
      orderDirection: ' ASC ',
      simple:true
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async insertAsientoEncabezado(Asiento:any){
    let sql = {
      table: 'Cge_Asiento_Contable_Encabezado',
      fields: 'Descripcion,Documento,Tipo_Cambio,Registro_Origen,Sistema_Origen,Id_Periodo,Fecha,Debitos,Creditos,Diferencia,Estado',
      values: '\'' + Asiento.Descripcion
      + '\',\'' + Asiento.Documento
      + '\',\'' + Asiento.Tipo_Cambio
      + '\',\'' + Asiento.Registro_Origen
      + '\',\'' + Asiento.Sistema_Origen
      + '\',\'' + Asiento.Id_Periodo
      + '\',\'' + Asiento.Fecha
      + '\',\'' + Asiento.Debitos
      + '\',\'' + Asiento.Creditos
      + '\',\'' + Asiento.Diferencia
      + '\',\'' + Asiento.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateAsientoEncabezado(Asiento:any){
    let sql = {
      table: 'Cge_Asiento_Contable_Encabezado',
      fields: 'Descripcion=\'' + Asiento.Descripcion
      + '\',Documento=\'' + Asiento.Documento
      + '\',Tipo_Cambio=\'' + Asiento.Tipo_Cambio
      + '\',Registro_Origen=\'' + Asiento.Registro_Origen
      + '\',Sistema_Origen=\'' + Asiento.Sistema_Origen
      + '\',Id_Periodo=\'' + Asiento.Id_Periodo
      + '\',Fecha=\'' + Asiento.Fecha
      + '\',Debitos=\'' + Asiento.Debitos
      + '\',Creditos=\'' + Asiento.Creditos
      + '\',Diferencia=\'' + Asiento.Diferencia
      + '\',Estado=\'' + Asiento.Estado
      + '\'',
      where: 'Id_Asiento_Contable_Encabezado=' + Asiento.Id_Asiento_Contable_Encabezado
    };
    return await this.apiService.updateRecord(sql);
  }

  async insertAsientoDetalle(Detalle:any){
    let sql = {
      table: 'Cge_Asiento_Contable_Detalle',
      fields: 'Id_Asiento_Contable_Encabezado,Cuenta,Moneda,Detalle_Cuenta,Documento,Debe,Haber,Debe_Me,Haber_Me',
      values: '\'' + Detalle.Id_Asiento_Contable_Encabezado
      + '\',\'' + Detalle.Cuenta
      + '\',\'' + Detalle.Moneda
      + '\',\'' + Detalle.Detalle_Cuenta
      + '\',\'' + Detalle.Documento
      + '\',\'' + Detalle.Debe
      + '\',\'' + Detalle.Haber
      + '\',\'' + Detalle.Debe_Me
      + '\',\'' + Detalle.Haber_Me
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateAsientoDetalle(Detalle:any){
    let sql = {
      table: 'Cge_Asiento_Contable_Detalle  ',
      fields: 'Cuenta=\'' + Detalle.Cuenta
      + '\',Moneda=\'' + Detalle.Moneda
      + '\',Detalle_Cuenta=\'' + Detalle.Detalle_Cuenta
      + '\',Documento=\'' + Detalle.Documento
      + '\',Debe=\'' + Detalle.Debe
      + '\',Haber=\'' + Detalle.Haber
      + '\',Debe_Me=\'' + Detalle.Debe_Me
      + '\',Haber_Me=\'' + Detalle.Haber_Me
      + '\'',
      where: 'Id_Asiento_Contable_Detalle=' + Detalle.Id_Asiento_Contable_Detalle
    };
    return await this.apiService.updateRecord(sql);
  }
  async deleteDetails(Id_Asiento_Contable_Encabezado,Lista){
    let sql = "DELETE FROM Cge_Asiento_Contable_Detalle WHERE Id_Asiento_Contable_Encabezado = " + Id_Asiento_Contable_Encabezado + " and Id_Asiento_Contable_Detalle Not In (" + Lista + ")";
    return await this.apiService.postRecord(sql);
  }
}
