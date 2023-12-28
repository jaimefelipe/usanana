import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaCService {

  constructor(
    private apiService: ApiService
  ) { }

  async loadInvoices(paginacion,search?){
    let Master = localStorage.getItem('ToxoMT');
    let where = '';
    if(Master != '1'){
      where = ' and Ven_Factura.Id_Empresa = ' + localStorage.getItem('Id_Empresa');
    }
    let sqlConfig = {
      table: 'Ven_Factura inner join Gen_Empresa on Gen_Empresa.Id_Empresa = Ven_Factura.Id_Empresa',
      fields: 'Ven_Factura.Id_Empresa,Id_Factura,Consecutivo,Ven_Factura.Creado_El,Tipo_Documento,Ven_Factura.Nombre,Ven_Factura.Numero_Identificacion,Respuesta_MH, Gen_Empresa.Nombre as Empresa, Error_MH',
      orderField: '',
      searchField: search,
      Empresa:false,
      where : "Respuesta_MH = 'rechazado'" + where,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadInvoice(Id_Factura){
    let sqlConfig = {
      table: 'Ven_Factura',
      fields: 'Id_Factura,Id_Caja,Tipo_Documento,Nombre,Codigo_Identificacion,Numero_Identificacion,Correo,Condicion_Venta,Plazo_Credito,Metodo_Pago,Moneda,Tipo_Cambio,IVA,Sub_Total,Total,Respuesta_MH,Error_MH,Consecutivo,Creado_El',
      orderField: '',
      searchField: '',
      Empresa:false,
      where: 'Id_Factura = ' + Id_Factura
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async updateConscutivo(Consecutivo,Id_Factura,Id_Caja){
    let NuevoConsecutivo = 1;
    NuevoConsecutivo = Consecutivo + NuevoConsecutivo;
    let sql = "Update Ven_Factura set Consecutivo = "+Consecutivo+",Clave_Numerica = NULL,Estado_Token_MH=NULL,Estado_Envio_MH=NULL,Respuesta_MH='Registrado',Error_MH=NULL where Id_Factura =" + Id_Factura;
    await this.apiService.postRecord(sql);
    // let sql1 = "Update Ven_Caja set Consecutivo ="+ NuevoConsecutivo +" where Id_Caja ="+Id_Caja;
    // await this.apiService.postRecord(sql1);
    return true
  }

}
