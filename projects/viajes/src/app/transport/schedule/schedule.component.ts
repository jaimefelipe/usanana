import { Component, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { RouteService } from '../route/route.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  constructor(private scheduleService: ScheduleService,
    private routeService:RouteService
    ) {}
  searchField = '';
  searchFieldRoutes = '';
  RoutesPanel = false;
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  Horas = Array();
  edit = false;
  Schedules = [];
  Routes = [];
  Schedule = {
    Id_Horario: '',
    Id_Ruta: '',
    Horario: '',
    Nombre:''
  };

  ngOnInit(): void {
    this.search();
    this.searchRoutes();
    let hora = '';
      let y =0;
      for (let i = 0; i < 24; i++) {
        for (let x = 0; x < 60;) {
            if(x ==0){
              hora = i + ':00';
            }else{
              hora = i + ':' + x;
            }
            this.Horas.push(hora);
            x = x + 10;
        }
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
    this.loadSchedules();
  }
  keytab(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabRoutes(event){
    if (event.key === 'Enter') {
      this.searchRoutes();
    }
  }
  search() {
    this.loadSchedules(this.searchField);
  }
  async searchRoutes(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.routeService.loadRoutes(paginacion, this.searchFieldRoutes);
    this.Routes = data['data'];
  }
  async loadSchedules(search?: any) {
    let data = await this.scheduleService.loadSchedules(
      this.paginacion,
      search
    );
    if (data['total'] == 0) {
      this.Schedules = [];
    } else {
      this.Schedules = data['data'];
    }
  }
  async editRecord(Schedule) {
    this.edit = true;
    if (Schedule) {
      this.Schedule.Id_Horario = Schedule.Id_Horario;
      this.loadSchedule();
    } else {
      this.Schedule = {
        Id_Horario: '',
        Id_Ruta: '',
        Horario: '',
        Nombre:''
      };
    }
  }
  async loadSchedule(){
    let data = await this.scheduleService.loadSchedule(this.Schedule.Id_Horario);
    if(data['total']==1){
      this.Schedule = data['data'][0];
    }
  }
  async grabar(){
    if (this.Schedule.Id_Horario == "") {
      //Insertar header
      let data = await this.scheduleService.insertSchedule(this.Schedule);
    }else{
      //Update header
      let data = await this.scheduleService.updateSchedule(this.Schedule);
    }
    this.search();
    this.cancel();

  }
  cancel(){
    this.edit = false;
  }
  openRoutesPanel(){
    this.RoutesPanel = true;
  }
  closeRoutesPanel(){
    this.RoutesPanel = false;
  }
  SeleccionarRuta(Ruta){
    this.Schedule.Id_Ruta = Ruta.Id_Ruta;
    this.Schedule.Nombre = Ruta.Nombre;
    this.closeRoutesPanel();
  }

}
