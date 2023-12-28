import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import { ProyActividadService } from './proy-actividad.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-proy-actividad',
  templateUrl: './proy-actividad.component.html',
  styleUrl: './proy-actividad.component.css',
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ProyActividadComponent implements OnInit {
  @Input() ItemSelected: EventEmitter<string>; 
  @Output() NewItem = new EventEmitter<any>();

  constructor(private proyActividadService: ProyActividadService) {}
  Proyecto = {
    Id_Proyecto:'',
    Tipo:'1',
    Nivel:'0',
    Codigo:'',
    Padre:'',
    Nombre: '',
    Descripcion:'',
    Objetivo:'',
    Alcance:'',
    Restricciones:'',
    Inicio:'',
    Fin:''
  }
  NivelActual = '1';
  CodigoActual = '';
  UltimoCodigo = '';

  ngOnInit(): void {
    this.subscribeToParentEmitter(); 
  }

  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      this.Proyecto.Id_Proyecto = data;
      this.leerProyecto()
      //this.message = data; 
    }); 
  } 
  async leerProyecto(){
    let data = await this.proyActividadService.leerProyecto(this.Proyecto.Id_Proyecto)
    if (data['total'] == 1) {
      this.Proyecto = data['data'][0];
    }
  }
  async getLastProyectoId(Nivel){
    //obtener el Id el ultimo portafolio para generar uno nuevo
    let data = await this.proyActividadService.getLastProyectId(Nivel);
    if (data['total'] == 0) {
      this.UltimoCodigo = '0';
    }else{
      this.UltimoCodigo = data['data'][0]['Codigo'];
    }
  }
  async nuevoPadre(){
    this.inicializarProyecto();
    await this.getLastProyectoId(1);
    this.Proyecto.Nivel = '1';
    
    this.Proyecto.Codigo = (parseInt(this.UltimoCodigo) + 1).toString();
  }
  async nuevoHijo(){
    //Deternimar el nivel
    let nivel = this.Proyecto.Nivel;
    let codigo = this.Proyecto.Codigo;
    //Determinar el codigo
    this.inicializarProyecto();
  
    this.Proyecto.Nivel = (parseInt(nivel) +1).toString();
    this.Proyecto.Tipo = this.Proyecto.Nivel;
    this.Proyecto.Padre = codigo;
   
    await this.getLastProyectoId(this.Proyecto.Nivel);
    this.Proyecto.Codigo = codigo + "."+ (parseInt(this.UltimoCodigo) + 1);
  }
  inicializarProyecto(){
    this.Proyecto = {
      Id_Proyecto:'',
      Tipo:'1',
      Nivel:'1',
      Codigo:'',
      Padre:'',
      Nombre: '',
      Descripcion:'',
      Objetivo:'',
      Alcance:'',
      Restricciones:'',
      Inicio:'',
      Fin:''
    }
  }
  grabar(){
    //Enviar evento al treee
    if(this.Proyecto.Id_Proyecto == ''){
      //Proyecto Nuevo
      this.proyectoNuevo()
    }else{
      //actualizar proyecto
      this.actualizarProyecto();
    }
  }
  async  proyectoNuevo(){
    let data = await this.proyActividadService.newProyecto(this.Proyecto);
    if(data['success'] == 'true'){
      this.Proyecto.Id_Proyecto = data['data'][0]['Identity'];
      this.NewItem.emit(this.Proyecto);
    }
    Swal.fire('Datos Actualizados')
  }
  async actualizarProyecto(){
    let data = await this.proyActividadService.updateProyecto(this.Proyecto);
    Swal.fire('Datos Actualizados')
  }
}
