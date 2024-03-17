import { Component,OnInit, Input } from '@angular/core';
import { ProySchedulerService } from './proy-scheduler.service';
import { ProyActividadService } from '../proy-actividad/proy-actividad.service';
import {  format, addDays, startOfWeek, endOfWeek, subDays } from 'date-fns';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-proy-scheduler',
  templateUrl: './proy-scheduler.component.html',
  styleUrl: './proy-scheduler.component.css'
})
export class ProySchedulerComponent implements  OnInit{
  @Input() ItemSelected: EventEmitter<string>; 
  @Input() TabSelected: EventEmitter<string>; 

  constructor(private proySchedulerService:ProySchedulerService,
    private proyActividadService:ProyActividadService) {}

  Task_Id = '';
  Tab_Id = '';
  EventoPanel = false;
  GeneralTabActivo = true;
  SeguimientoTabActivo = false;
  MesPanel = true;
  SemanaPanel = false;
  Fecha = new Date();
  dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  GeneralClass = 'text-success tablinks active';
  SeguimientoClass = '';

  date = new Date();
  FechaHoy = this.date.getDate() + '-'+  this.date.getMonth() + 1 + "-"+ this.date.getFullYear()
  FechaInicio =  {
    month: this.date.getMonth() + 1,
    day: this.date.getDate(),
    year: this.date.getFullYear()
  }
  FechaFin =  {
    month: this.date.getMonth() + 1,
    day: this.date.getDate(),
    year: this.date.getFullYear()
  }
  year = this.date.getFullYear();
  month = this.date.getMonth();
  day = this.date.getDay();

  // Obtiene el primer dia del mes
  dayone:any;
  // Obtiene el ultimo dia del mes
  lastdate:any;
   // Obtienen el dia de la ultima fecha del mes
  dayend:any;
   // Obtinene la ultima fecha del mes anterior.
  monthlastdate:any;

  FechasAmostrar = [];
  FechasSemana= [];
  eventos = [];
  Seguimientos = [];
  eventosSemana = [];
  currdate = '';
  Seguimiento = '';
  Evento = {
    Id_Proyecto:'',
    Nombre:'',
    Descripcion:'',
    Inicio:'',
    HInicio:'',
    Fin:'',
    HFin:'',
    Estado:'1',
    Miembros:''
  };
  // Array of month names
  months = [
    "Enero",
    "Febrero",
    "Marzo",
    "April",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  
  ngOnInit(): void {
    this.subscribeToParentEmitter(); 
  }  

  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      this.Task_Id = data;
      this.manipulate();
    }); 
    this.TabSelected.subscribe((data: any) => { 
        this.Tab_Id = data;
        this.manipulate();
    });
  } 

  // Function to generate the calendar
  SelectMes(){
    this.MesPanel = true;
    this.SemanaPanel = false;
  }
  SelectSemana(){
    this.MesPanel = false;
    this.SemanaPanel = true;
    this.CrearArraySemana();
  }

  async leerEventos(inicio,fin){
    let data = await this.proySchedulerService.leerActividades('',inicio,fin);
    if(data['total'] == 0 ){
      this.eventos = [];
    }else{
      this.eventos = data['data'];
    }
  }
  
  async CrearArraySemana(){
    // Determinar la semana actual
    this.FechasSemana = [];
    let Fecha = new Date(this.year,this.month,this.day);
    const daysOfWeek = [];
    const startDate = startOfWeek(Fecha);
    const endDate = endOfWeek(Fecha);

    for (let i = 0; i < 7; i++) {
        const currentDay = addDays(startDate, i);
        //const formattedDay = format(currentDay, 'dd/MM/yyyy');
        //console.log(currentDay.getDate())
        daysOfWeek.push(currentDay.getDate());
    }
    //console.log(daysOfWeek)
    this.FechasSemana  = daysOfWeek;
    this.currdate = this.months[this.month] + ' ' + this.year;
    this.popularEventosEnSemana();
  }

  popularEventosEnSemana(){
    let semana = [];
    //for (let i = 0; i < 7; i++) {
    //Recorrer las horas
    for (let x = 7; x < 19; x++) {
      let hora = [];
      let hour = [{
        Nombre: x + ":00"
      }]
      hora.push(hour);
      //for (let x = 7; x < 19; x++) {
      // recorrer los dias de la semana
      for (let i = 0; i < 7; i++) {
        let eventos = []
        // recorrer los eventos
        for (let y = 0; y < this.eventos.length; y++) {
          let StartArr = this.eventos[y]['Inicio'].split(" ");
          let DateStartArr = StartArr[0].split('-');
          let HoraStartArr = StartArr[1].split(':');
          
          let EndArr = this.eventos[y]['Fin'].split(" ");
          let DateEndArr = EndArr[0].split('-');
          let HoraEndArr = EndArr[1].split(':');

          // Determinar si el evento esta dentro de la hora

          // x la hora
          // i el dia
          // y el evento   
          
          // si el evento es mayor o igual que la hora de inicio y menor o igual que la hora de fin 
          if(parseInt(HoraStartArr[0]) >= x && parseInt(HoraStartArr[2]) <= x){
            //Determinar si el evento es mayor o igual que el dia 
            if(parseInt(DateStartArr[2]) >= i && parseInt(DateStartArr[2]) <= i){
              eventos.push(this.eventos[y])
            }
          }
        }
        hora.push(eventos);
      }
      semana.push(hora);
    }
    console.log(semana)
    this.eventosSemana = semana;
    
  }


  async  manipulate(){
    this.dayone = new Date(this.year, this.month, 1).getDay();
    console.log('ULtimo Dia del mes',this.dayone);
  // Obtiene el ultimo dia del mes
    this.lastdate = new Date(this.year, this.month + 1, 0).getDate();
    console.log('ultimo dia del mes',this.lastdate);
   // Obtienen el dia de la ultima fecha del mes
    this.dayend = new Date(this.year, this.month, this.lastdate).getDay();
    console.log('ultimo dia de la ultima fecha del mes',this.dayend)
   // Obtinene la ultima fecha del mes anterior.
    this.monthlastdate = new Date(this.year, this.month, 0).getDate();
    console.log('Ultima fecha del mes anterior',this.monthlastdate);
    // Loop to add the last dates of the previous month
    // Bucle para agregar las ultimas fechas del mes anterior
    
    let Inicio = this.year + '-'+  (this.month +1)  + '-' + 1 + ' 00:00:00';
    let Fin = this.year + '-'+  (this.month +1) + '-' + this.lastdate + ' 23:59:59';
    this.FechasAmostrar = [];
    await this.leerEventos(Inicio,Fin);

    for (let i = this.dayone; i > 0; i--) {
        let dia  = {
          dia:this.monthlastdate - i + 1,
          class:'inactive',
          eventos:[]
        }
        this.FechasAmostrar.push(dia);
    }
 
    // Loop to add the dates of the current month
    // Cliclo para agregar las fehcas del mes actual.
    for (let i = 1; i <= this.lastdate; i++) {
 
        // Check if the current date is today
        let isToday = i === this.date.getDate()
            && this.month === new Date().getMonth()
            && this.year === new Date().getFullYear()
            ? "active"
            : "";
        
        //Averiguar si algun evento pertenece a la fecha 
        let event = [];
        for (let x = 0; x < this.eventos.length; x++) {
          let Start = parseInt(this.eventos[x]['Inicio'].substring(8,10));
          let End = parseInt(this.eventos[x]['Fin'].substring(8,10));
          if(Start == i || End == i){
            event.push(this.eventos[x]);
          }
        }
        
        let dia  = {
          dia:i,
          class:isToday,
          eventos:event
        }

        this.FechasAmostrar.push(dia);
    }
 
    // Loop to add the first dates of the next month
    // Cliclo par agregar las primeras fechas del proximo mes.
    for (let i = this.dayend; i < 6; i++) {
        let dia  = {
          dia:i - this.dayend + 1,
          class:'inactive',
          eventos:[]
        }
        this.FechasAmostrar.push(dia);
    }
 
    // Update the text of the current date element 
    // with the formatted current month and year
    this.currdate = this.months[this.month] + ' ' + this.year;
  }
  
  anterior(){
    if(this.MesPanel){
      this.month = this.month - 1;
      this.alCambiarMes();
    }
    if(this.SemanaPanel){
      if(this.day > 7){
        this.day = this.day - 7;
      }else{

        this.day = this.monthlastdate - (7-this.day);
        this.month = this.month -1;
        if(this.month < 0){
          this.month = 11;
        }
      }
      this.CrearArraySemana();
    }
    
  }
  siguiente(){
    if(this.MesPanel){
      this.month = this.month + 1;
      if(this.month > 11){
        this.month = 0;
      }
      this.alCambiarMes();
    }
    if(this.SemanaPanel){
      let Fecha = new Date(this.year,this.month,this.day);
      Fecha.setDate(Fecha.getDate()+7)
      this.month = Fecha.getMonth();
      this.day = Fecha.getDate();
      this.CrearArraySemana();
    }
  }
  alCambiarMes(){
    this.FechasAmostrar = [];
  // Check if the month is out of range
    if (this.month < 0 || this.month > 11) {

      // Set the date to the first day of the 
      // month with the new year
      this.date = new Date(this.year, this.month, new Date().getDate());

      // Set the year to the new year
      this.year = this.date.getFullYear();

      // Set the month to the new month
      this.month = this.date.getMonth();
    }

    else {

      // Set the date to the current date
      this.date = new Date();
    }

    // Call the manipulate function to 
    // update the calendar display
    this.manipulate();
  }
	openEventoPanel(Evento){
    this.Evento = Evento;
    this.leerSeguimientos();
    let horaIniciArr = this.Evento.Inicio.split(" ");
    let horaFinArr = this.Evento.Fin.split(" ");
    this.Evento.HInicio = horaIniciArr[1];
    this.Evento.HFin = horaFinArr[1];
    this.EventoPanel = true;
  }
  cerrarEventoPanel(){
    this.EventoPanel = false;
  }
  activarTabGeneral(){
    this.GeneralTabActivo = true;
    this.SeguimientoTabActivo = false;
    this.GeneralClass = 'text-success tablinks active';
    this.SeguimientoClass = '';
  }
  activarTabSeguimiento(){
    this.SeguimientoTabActivo = true;
    this.GeneralTabActivo = false;
    this.GeneralClass = '';
    this.SeguimientoClass = 'text-success tablinks active';
  }
  async leerSeguimientos(){
    let data = await this.proyActividadService.leerNotas(this.Evento.Id_Proyecto);
    if (data['total'] == 0) {
      this.Seguimientos = [];
    }else{
      this.Seguimientos = data['data'];
      for (let Seguimiento of this.Seguimientos){
        let Letras = Seguimiento.Nombre.split(' ');
        Seguimiento.Nombre = Letras[0].substring(0,1)+ Letras[1].substring(0,1);
        Seguimiento.Fecha = Seguimiento.Fecha.substring(0,10)
      }
    }
  }
  async agregarSeguimieto(){
    let Seguimiento = {
      Id_Proyecto:this.Evento.Id_Proyecto,
      Id_Persona:localStorage.getItem('Id_Usuario'),
      Fecha:this.FechaHoy,
      Nombre:localStorage.getItem('Nombre_Usuario').substring(0,2),
      Nota:this.Seguimiento
    }
    this.Seguimientos.push(Seguimiento);
    this.Seguimiento = '';
    await this.proyActividadService.nuevaNota(Seguimiento);
  }
}
