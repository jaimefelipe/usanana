import { FacturaCService } from './facturaC.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Component({
  selector: 'app-factura',
  templateUrl: './facturaC.component.html',
  styleUrls: ['./facturaC.component.css']
})
export class FacturaComponentC implements OnInit {

  constructor(
    private invoiceService: FacturaCService,
    private apiService: ApiService
    ) {}

  searchField = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  Invoices = []
  Factura = {
    Id_Factura: "",
    Id_Caja:"",
    Tipo_Documento: "",
    Id_Cliente: "",
    Nombre: "",
    Codigo_Identificacion: "",
    Numero_Identificacion: "",
    Correo: "",
    Condicion_Venta: "",
    Plazo_Credito: "",
    Metodo_Pago: "",
    Moneda: "",
    Tipo_Cambio: "",
    IVA: 0,
    Sub_Total: 0,
    Total: 0,
    Respuesta_MH: "Registrado",
    Error_MH:'',
    Creado_El: "",
    Consecutivo: ""
  }

  ngOnInit(): void {
    this.loadInvoices(this.searchField);
  }
  search() {
    this.loadInvoices(this.searchField);
  }
  async loadInvoices(search?) {
    let data = await this.invoiceService.loadInvoices(this.paginacion, search);
    if (data["total"] == 0) {
      this.Invoices = [];
    } else {
      this.Invoices = data["data"];
    }
  }
  keytab1(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }
  ChangePage(action) {
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow = this.paginacion.FirstRow - 50;
        this.paginacion.LastRow = this.paginacion.LastRow - 50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow + 50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadInvoices();
  }
  async editRecord(factura) {
    let data = await this.invoiceService.loadInvoice(factura.Id_Factura);
    this.Factura = data['data'][0];
    this.edit = true;

  }
  cancel(){
    this.edit = false;
  }
  async grabar(){
    await this.invoiceService.updateConscutivo(this.Factura.Consecutivo,this.Factura.Id_Factura,this.Factura.Id_Caja);
    this.loadInvoices();
    this.cancel();
  }
}
