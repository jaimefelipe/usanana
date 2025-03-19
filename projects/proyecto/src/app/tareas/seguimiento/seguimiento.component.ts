import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SeguimientoService } from './seguimiento.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {

  constructor(private seguimientoService:SeguimientoService) { }
  
    edit = false;
    searchField = '';
    bankAccountans = [];
    paginacion = {
      FirstRow: 1,
      LastRow: 25,
      TotalRows: 0
    };
    Centros = [];
    Centro = {
      Id_Centro_Costo:'',
      Nombre:''
    }
  
    ngOnInit(): void {
      this.loadCentros();
    }
    ChangePage(action){
      if (action == 0) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 25;
      }
      if (action == 1) {
        if (this.paginacion.FirstRow < 25) {
          this.paginacion.FirstRow = 1;
          this.paginacion.LastRow = 25;
        } else {
          this.paginacion.FirstRow= this.paginacion.FirstRow -25;
          this.paginacion.LastRow= this.paginacion.LastRow -25;
        }
      }
      if (action == 2) {
        this.paginacion.FirstRow = this.paginacion.FirstRow +25;
        this.paginacion.LastRow = this.paginacion.LastRow + 25;
      }
      this.loadCentros();
    }
    keytab(event){
      if (event.key === 'Enter') {
        this.search();
      }
    }
    search(){
      this.loadCentros(this.searchField);
    }
    /**
     * Eventos del
     * Formulario de edición
     */
     cancel(){
       this.edit = false;
     }
     editRecord(Centro){
      this.edit = true;
      if(Centro){
          this.loadCentro(Centro.Id_Centro_Costo);
      }else{
        this.Centro = {
          Id_Centro_Costo:'',
         Nombre:''
        }
      }
     }
    async loadCentros(search?:any){
      let data = await this.seguimientoService.loadNotas(this.paginacion,search);
      if(data['total'] == 0){
        this.Centros = [];
      }else{
        this.Centros = data['data'];
      }
    }
    async loadCentro(Id_Centro_Contable){
      let data = await this.seguimientoService.loadCentro(Id_Centro_Contable);
      if(data['total'] == 0){
        this.Centro = {
          Id_Centro_Costo:'',
          Nombre:''
        }
      }else{
        this.Centro = data['data'][0];
      }
    }
    async grabar(){
      if(this.Centro.Nombre == ""){
        Swal.fire('Favor suministrar el nombre ');
        return false;
      }
     
      let data = await this.seguimientoService.saveCentro(this.Centro);
  
      if(data['success'] == 'true'){
        Swal.fire('Cuenta grabada correctamente');
        this.loadCentros(this.searchField);
        this.edit = false;
      }
      return true;
    }
  

}
