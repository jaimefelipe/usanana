import { Component, OnInit } from '@angular/core';
import { ConsecutivoService } from './consecutivo.service';

@Component({
  selector: 'app-consecutivo',
  templateUrl: './consecutivo.component.html',
  styleUrls: ['./consecutivo.component.css']
})
export class ConsecutivoComponent implements OnInit {

  constructor(private consecutivoService: ConsecutivoService) { }
  searchField = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  Consecutivos = [];
  Consecutivo = {
    Id_Caja:'',
    Id_Empresa:'',
    Nombre:'',
    Id_Sucursal:'',
    Numero_Caja:'',
    Consecutivo:''
  };

  ngOnInit(): void {
    this.getConsecutivos();
  }
  search() {
    this.getConsecutivos(this.searchField);
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
    this.getConsecutivos();
  }
  async getConsecutivos(search?){
    let data = await this.consecutivoService.getConsecutivos(this.paginacion,search);
    this.Consecutivos = data['data'];
  }
  async editRecord(Consecutivo) {
    this.Consecutivo = Consecutivo;
    this.edit = true;

  }
  cancel(){
    this.edit = false;
  }
  async grabar(){
    let data = await this.consecutivoService.setConsecutivo(this.Consecutivo.Consecutivo,this.Consecutivo.Id_Caja);
    //await this.invoiceService.updateConscutivo(this.Factura.Consecutivo,this.Factura.Id_Factura,this.Factura.Id_Caja);
    //this.loadInvoices();
    this.cancel();
  }

}
