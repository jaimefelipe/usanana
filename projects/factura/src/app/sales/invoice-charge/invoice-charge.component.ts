import { Component, OnInit } from '@angular/core';
import { InvoiceChargeService } from './invoice-charge.service';
import { CategoryService } from '../../../../../inventario/src/app/inventory/category/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-charge',
  templateUrl: './invoice-charge.component.html',
  styleUrls: ['./invoice-charge.component.css']
})
export class InvoiceChargeComponent implements OnInit {

  constructor(private invoiceChargeService:InvoiceChargeService,
    private categoryService:CategoryService) { }

  edit = false;
  searchField = '';
  Charges = [];
  Categories = [];
  Charge = {
    Id_Factura_Cargos:'',
    Nombre:'',
    Id_Categoria:'',
    Iva:'',
    Porcentaje:'',
    Estado:'',
    Codigo:''
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit() {
    this.loadCharges();
    this.loadCategories();
  }
  search(){
    this.loadCharges(this.searchField);
  }
  ChangePage(action){
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow= this.paginacion.FirstRow -50;
        this.paginacion.LastRow= this.paginacion.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow +50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadCharges();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  async loadCharges(search?){
    let data = await this.invoiceChargeService.loadChargees(this.paginacion,search);
    this.Charges = data['data'];
  }
  async editRecord(charge){
    if(charge){
      let data = await this.invoiceChargeService.loadCharge(charge.Id_Factura_Cargos);
      this.Charge = data['data'][0];
    }else{
      this.Charge = {
        Id_Factura_Cargos:'',
        Nombre:'',
        Id_Categoria:'',
        Iva:'',
        Porcentaje:'',
        Estado:'',
        Codigo:''
      }
    }
    this.edit = true;

  }
  async grabar(){
    if(this.Charge.Id_Factura_Cargos == ''){
      await this.invoiceChargeService.insertCharge(this.Charge);
    }else{
      await this.invoiceChargeService.updateCharge(this.Charge);
    }
    Swal.fire('Cargo Actualizado');
    this.loadCharges();
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }
  async loadCategories(search?:any){
    let data = await this.categoryService.loadCategories(this.paginacion,search);
    if(data['total'] == 0){
      this.Categories = [];
    }else{
      this.Categories = data['data'];
    }
  }
}
