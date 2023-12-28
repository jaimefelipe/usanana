import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private apiService: ApiService) { }
  async loadUserId(){
    let sql = "Select Numero_Identificacion from Seg_Usuario where Id_Usuario = " + localStorage.getItem('Id_Usuario');
    return await this.apiService.postRecord(sql);
  }
  async loadClientId(){
    let UserId = await this.loadUserId();
    let sql = "Select Id_Persona from Gen_Persona where Id_Empresa = 7 and Identificacion = " + UserId['data'][0]['Numero_Identificacion'];
    return await this.apiService.postRecord(sql);
  }
  async loadUpaidInvoices(){
    let ClientId = await this.loadClientId();
    let sql = "Select Ven_Factura.Id_Factura,Ven_Factura_Detalle.Descripcion, Ven_Factura.Moneda,Ven_Factura.Sub_Total,Ven_Factura.IVA,Ven_Factura.Total  from  Ven_Factura inner join Ven_Factura_Detalle on Ven_Factura.Id_Factura = Ven_Factura_Detalle.Id_Factura where Ven_Factura.Id_Empresa = 7 and Ven_Factura.Respuesta_MH = 'Registrado' and Ven_Factura.Id_Cliente =" + ClientId['data'][0]['Id_Persona'];
    return await this.apiService.postRecord(sql);
  }
  async updatePaid(Recibo){
    let sql = "Insert into Ven_Recibo (Id_Empresa,Metodo_pago,Facturas,Numero_Comprobante,Fecha,Monto,Creado_El,Creado_Por) values ("+localStorage.getItem('Id_Empresa') + ","+ Recibo.Metodo_pago + ",'"+Recibo.Facturas+"','"+Recibo.Numero_Comprobante+"','"+Recibo.Fecha+"',"+Recibo.Monto+",GETDATE(),'"+localStorage.getItem("Nombre_Usuario")+"')";
    return await this.apiService.postRecord(sql);
  }
  async sendPaymentMail(Id,Name){
    return await this.apiService.sendPaymentmail(Id,Name);
  }

}
