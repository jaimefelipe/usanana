import { FacturaService } from './facturas.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturaComponent implements OnInit {

  constructor(private facturaService:FacturaService) { }
  unpaidInvoice = [];
  Recibo = {
    Metodo_pago:'1',
    Facturas:'',
    Numero_Comprobante:'',
    Fecha:'',
    Monto:''
  }
  ngOnInit(): void {
    this.loadUpaidInvoices();
  }
  async loadUpaidInvoices(){
    let unpaidInvoice = await this.facturaService.loadUpaidInvoices();
    this.unpaidInvoice = unpaidInvoice['data'];
  }
  async updateData(){
    if(this.Recibo.Facturas == ""){
      Swal.fire("Debe especificar la factura a pagar");
      return false;
    }
    if(this.Recibo.Fecha == ""){
      Swal.fire("Debe especificar la fecha del pago");
      return false;
    }
    if(this.Recibo.Monto == ""){
      Swal.fire("Debe especificar monto del Pago");
      return false;
    }
    if(this.Recibo.Numero_Comprobante == ""){
      Swal.fire("Debe especificar Número de Comprobante de Pago");
      return false;
    }
    await this.facturaService.updatePaid(this.Recibo);
    await this.facturaService.sendPaymentMail(localStorage.getItem('Id_Usuario'),localStorage.getItem('Nombre_Usuario'));
    Swal.fire("Gracias por reportar su págo, Una vez validado se habilitará su cuenta");
    return true;
  }
}
