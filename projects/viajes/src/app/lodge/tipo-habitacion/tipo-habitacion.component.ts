import { Component, OnInit } from '@angular/core';
import { TipoHabitacionService } from './tipo-habitacion.service';

@Component({
  selector: 'app-tipo-habitacion',
  templateUrl: './tipo-habitacion.component.html',
  styleUrls: ['./tipo-habitacion.component.css']
})
export class TipoHabitacionComponent implements OnInit {

  constructor(
    private tipoHabitacionService:TipoHabitacionService
  ) { }
  edit = false;
  TipoPanel = false;

  searchField = '';

  TiposHabitacion = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  TipoHabitacion = {
    Id_Tipo_Habitacion:'',
    Nombre: ''
  }

  ngOnInit() {
    this.cargarTiposHabitacion();
  }
  search(){
    this.cargarTiposHabitacion(this.searchField);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
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
    this.cargarTiposHabitacion();
  }
  async cargarTiposHabitacion(search?:any){
    let data = await this.tipoHabitacionService.cartarTipodeHabitacion(this.paginacion,search);
    if(data['total'] == 0){
      this.TiposHabitacion = [];
    }else{
      this.TiposHabitacion = data['data'];
    }
  }
  async editRecord(TipoHabitacion){
    this.TipoHabitacion = {
      Id_Tipo_Habitacion:'',
      Nombre: ''
    }
    if(TipoHabitacion){
      let data = await this.tipoHabitacionService.cargarTipo(TipoHabitacion.Id_Tipo_Habitacion);
      if(data['total']==1){
        this.TipoHabitacion = data['data'][0];
      }
    }
    this.edit = true;
  }

  async grabar(){
    if(this.TipoHabitacion.Id_Tipo_Habitacion == ""){
      await this.tipoHabitacionService.EditarTipo(this.TipoHabitacion);
    }else{
      await this.tipoHabitacionService.NuevoTipo(this.TipoHabitacion);
    }
    this.cargarTiposHabitacion();
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }
}
