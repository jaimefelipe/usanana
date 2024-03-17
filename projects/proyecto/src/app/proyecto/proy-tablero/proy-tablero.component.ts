import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ProyTableroService } from './proy-tablero.service';

@Component({
  selector: 'app-proy-tablero',
  templateUrl: './proy-tablero.component.html',
  styleUrls: ['./proy-tablero.component.css']
})
export class ProyTableroComponent implements OnInit {
  
  @Input() ItemSelected: EventEmitter<string>; 
  @Input() TabSelected: EventEmitter<string>; 
  @Input() FechaInicioSelected:EventEmitter<string>;
  @Input() FechaFinSelected:EventEmitter<string>;

  constructor(
    private proyTableroService:ProyTableroService
  ) { }
  loading = false;
  MensajeLoading = "Cargando Tareas";
   Task_Id = '';
   Tab_Id = '';
   Pendientes = [];
   Proceso = [];
   Ajustes = [];
   VistoBueno = [];
   Aprobado =[];
   Terminado = [];
   FechaInicio:any;
   FechaFin:any;
  ItemTrasladandose = {
    Id_Proyecto:''
  };
  panelOrigen = '';
  ngOnInit() {
    this.subscribeToParentEmitter(); 
  }
  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      if(this.Task_Id != data){
        this.Task_Id = data;
        this.leerDatos();
      }
      
    }); 
    this.TabSelected.subscribe((data: any) => { 
      if(this.Tab_Id !=data){
        this.Tab_Id = data;
        this.leerDatos();
      }
    });
    this.FechaInicioSelected.subscribe((data: any) => { 
      this.FechaInicio = data.day + '/' +data.month + '/' + data.year
      this.leerDatos();
    });
    this.FechaFinSelected.subscribe((data: any) => { 
      this.FechaFin = data.day + '/' +data.month + '/' + data.year
      this.leerDatos();
     });
  } 
  async leerDatos(){
    this.loading = true;
    if(this.Tab_Id == '2'){
      this.Pendientes = [];
      this.Proceso = [];
      this.Ajustes = [];
      this.VistoBueno= [];
      this.Aprobado= [];
      this.Terminado = [];

      let data = await this.proyTableroService.leerItems(this.Task_Id,1,this.FechaInicio,this.FechaFin);
      this.Pendientes = data['data'];

      data = await this.proyTableroService.leerItems(this.Task_Id,2,this.FechaInicio,this.FechaFin);
      this.Proceso = data['data'];

      data = await this.proyTableroService.leerItems(this.Task_Id,3,this.FechaInicio,this.FechaFin);
      this.Ajustes = data['data'];

      data = await this.proyTableroService.leerItems(this.Task_Id,4,this.FechaInicio,this.FechaFin);
      this.VistoBueno = data['data'];

      data = await this.proyTableroService.leerItems(this.Task_Id,5,this.FechaInicio,this.FechaFin);
      this.Aprobado = data['data'];

      data = await this.proyTableroService.leerItems(this.Task_Id,6,this.FechaInicio,this.FechaFin);
      this.Terminado = data['data'];

    }
    this.loading = false;
  }
  drag(ev,elemento,panel) {
    console.log(elemento)
    this.ItemTrasladandose = elemento;
    this.panelOrigen = panel;
    //Eliminar el elemento del array
  
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  
  drop(ev,panel) {
    ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
    switch (panel) {
      case 'Pendientes':
        // código para la opción 1
        this.Pendientes.push(this.ItemTrasladandose);
        this.actualizarEstadoTarea(1);
        break;
      case 'proceso':
        // código para la opción 2
        this.Proceso.push(this.ItemTrasladandose);
        this.actualizarEstadoTarea(2);
        break;
      case 'ajustes':
        // código para la opción 2
        this.Ajustes.push(this.ItemTrasladandose);
        this.actualizarEstadoTarea(3);
        break;
      case 'VistoBueno':
        // código para la opción 2
        this.Ajustes.push(this.ItemTrasladandose);
        this.actualizarEstadoTarea(4);
        break;
      case 'Aprobado':
        // código para la opción 2
        this.Ajustes.push(this.ItemTrasladandose);
        this.actualizarEstadoTarea(5);
        break;
      case 'Terminado':
        // código para la opción 2
        this.Ajustes.push(this.ItemTrasladandose);
        this.actualizarEstadoTarea(6);
        break;
      default:
        // código para el caso por defecto
    }
    switch(this.panelOrigen){
      case 'Pendientes':
        // código para la opción 1
        this.Pendientes = this.Pendientes.filter(ele => ele.Id_Proyecto !== this.ItemTrasladandose.Id_Proyecto);
        break;
      case 'proceso':
        // código para la opción 1
        this.Proceso = this.Proceso.filter(ele => ele.Id_Proyecto !== this.ItemTrasladandose.Id_Proyecto);
        break;
      case 'ajustes':
        // código para la opción 1
        this.Ajustes = this.Ajustes.filter(ele => ele.Id_Proyecto !== this.ItemTrasladandose.Id_Proyecto);
        break;
      case 'VistoBueno':
        // código para la opción 1
        this.VistoBueno = this.VistoBueno.filter(ele => ele.Id_Proyecto !== this.ItemTrasladandose.Id_Proyecto);
        break;
      case 'Aprobado':
        // código para la opción 1
        this.Aprobado = this.Aprobado.filter(ele => ele.Id_Proyecto !== this.ItemTrasladandose.Id_Proyecto);
        break;
      case 'Terminado':
        // código para la opción 1
        this.Terminado = this.Terminado.filter(ele => ele.Id_Proyecto !== this.ItemTrasladandose.Id_Proyecto);
        break;

    }
  }

  async actualizarEstadoTarea(Estado){
    let data = await this.proyTableroService.CambiarEstadoTarea(this.ItemTrasladandose.Id_Proyecto,Estado)
  }

}
