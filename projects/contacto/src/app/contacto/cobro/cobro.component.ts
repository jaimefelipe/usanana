import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { CobroService } from './cobro.service';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.css']
})
export class CobroComponent implements OnInit {

  @Input() Persona : any;
  constructor(
    private cobroService:CobroService
  ) { }

  PantallaCobros = false;
  searchField = '';
  Cobros = [];
  Cobro = {
    Id_Cobros:'',
    Id_Persona:'',
    Monto:'',
    Detalle:''
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  ngOnInit(): void {
    this.loadCobros();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Evento se dispara cuando hay cambios en el padre
    this.loadCobros();
  }
  search(){

  }
  keytab(e){

  }
  abrirPantallaCobros(Cobro){
    if(Cobro){
      this.Cobro = Cobro;
    }else{
      this.Cobro = {
        Id_Cobros:'',
        Id_Persona:'',
        Monto:'',
        Detalle:''
      }
    }
    this.PantallaCobros = true;
    this.loadCobros();
  }
  async GrabarCobro(){
    if(this.Cobro.Monto == ''){
      Swal.fire('No Puede grabar una cobro en blanco');
      return false;
    }
    this.Cobro.Id_Persona = this.Persona.Id_Persona;
    if(this.Cobro.Id_Cobros == ''){
      let data = await this.cobroService.NuevoCobro(this.Cobro);
    }else{
      let data = await this.cobroService.UpdateCobro(this.Cobro);
    }

    this.Cobro = {
      Id_Cobros:'',
      Id_Persona:'',
      Monto:'',
      Detalle:''
    }
    this.cerrarPantallaCobros();
    this.loadCobros();
    return true;
  }
  cerrarPantallaCobros(){
    this.PantallaCobros = false;
  }
  async loadCobro(Cobro){
    this.Cobro = Cobro;
  }

  async loadCobros(search?:any){
    let data = await this.cobroService.loadCobros(this.paginacion,'','',this.Persona.Id_Persona);
    if(data['total'] == 0){
      this.Cobros = [];
    }else{
      this.Cobros = data['data'];
    }
  }


}
