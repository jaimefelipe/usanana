import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ProyTableroService } from './proy-tablero.service';
//import { DayPilot } from "daypilot-pro-angular";
//import { DayPilot } from 'daypilot-pro-angular';
import { ProySchedulerService } from '../proy-scheduler/proy-scheduler.service';
import { DayPilot } from '../../../assets/daypilot/daypilot-all.min';


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
  @Output() SeleccionarItem = new EventEmitter<any>();

  constructor(
    private proyTableroService:ProyTableroService,
    private proySchedulerService:ProySchedulerService
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
   eventos = [];
   FechaInicio:any;
   FechaFin:any;
  ItemTrasladandose = {
    Id_Proyecto:''
  };
  panelOrigen = '';

  dp = new DayPilot.Kanban("dpK", {
    columnWidthSpec: "Auto",
    swimlaneMoveHandling: "Disabled",
    cardDeleteHandling: "Disabled",
    cardMoveHandling: "Update",
    onCardMoved: (args) => {
      args.control.message("Card moved: " + args.card.data.name);
    },
    columns: [
      {name: "Pendientes", id: "1", barColor: "#f9ba25"},
      {name: "En Proceso", id: "2"},
      {name: "Ajustes", id: "3"},
      {name: "Visto Bueno", id: "4"},
      {name: "Aprobado", id: "5"},
      {name: "Terminado", id: "6"}

    ]
});


  ngOnInit() {
    console.log(DayPilot)
    this.dp.onCardClicked = function(args){
      console.log(args)
    }
    this.dp.init()
    this.subscribeToParentEmitter(); 
  }
  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      if(this.Task_Id != data.value){
        this.Task_Id = data.value;
        if(data.level < 7){
          //this.leerDatos();
          this.leerEventos();
        }
      }
      
    }); 
    this.TabSelected.subscribe((data: any) => { 
      if(this.Tab_Id !=data){
        this.Tab_Id = data;
        //this.leerDatos();
        this.leerEventos();
      }
    });
    this.FechaInicioSelected.subscribe((data: any) => { 
      this.FechaInicio = data.day + '/' +data.month + '/' + data.year
      this.leerEventos();
    });
    this.FechaFinSelected.subscribe((data: any) => { 
      this.FechaFin = data.day + '/' +data.month + '/' + data.year
      this.leerEventos();
     });
  } 

async leerEventos(inicio?,fin?){
    if(this.Tab_Id == '2'){
      this.loading = true;
      if(!inicio){
        inicio = '2024-04-01';
        fin = '2024-04-30';
      }
      let data = await this.proySchedulerService.leerActividades('',inicio,fin);
      if(data['total'] == 0 ){
        this.eventos = [];
      }else{
        this.eventos = data['data'];
      }
      
      for(let i=0;i<this.eventos.length;i++){
        switch(this.eventos[i]['Estado']) { 
          case '1': { 
             //statements; 
             this.Pendientes.push(this.eventos[i]);
             break; 
          } 
          case '2': {
            this.Proceso.push(this.eventos[i]); 
             //statements; 
             break; 
          } 
          case '3': {
            this.Ajustes.push(this.eventos[i]); 
             //statements; 
             break; 
          }
          case '4': {
            this.VistoBueno.push(this.eventos[i]); 
             //statements; 
             break; 
          }
          case '5': {
            this.Terminado.push(this.eventos[i]); 
             //statements; 
             break; 
          }  
       } 
        this.eventos[i]['column'] = this.eventos[i]['Estado'];
      }

      this.dp.cards.list = this.eventos;
      this.dp.update();
      this.loading = false;
    }
  }

  drag(ev,elemento,panel) {
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
  dobleClick(elemento){
    this.SeleccionarItem.emit(elemento);
  }
}
