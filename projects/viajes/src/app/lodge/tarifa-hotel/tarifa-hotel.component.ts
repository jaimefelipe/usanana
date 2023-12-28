import { Component, OnInit } from '@angular/core';
import { TarifaHotelService } from './tarifa-hotel.service';
import { HotelService } from '../hotel/hotel.service';
import { TipoHabitacionService } from '../tipo-habitacion/tipo-habitacion.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tarifa-hotel',
  templateUrl: './tarifa-hotel.component.html',
  styleUrls: ['./tarifa-hotel.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class TarifaHotelComponent implements OnInit {

  constructor(
    private tarifaHotelService:TarifaHotelService,
    private hotelService:HotelService,
    private tipoHabitacionService:TipoHabitacionService
  ) { }

  edit = false;
  TarifaPanel = false;
  HospedajePanel = false;
  hoy = new Date();

  searchField = '';
  searchFieldHospedaje = ""
  TarifasHabitacion = [];
  TipoHabitaciones = [];
  Hoteles = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  TarifaHabitacion = {
    Id_Tarifa_Habitacion:'',
    Nombre: ''
  }

  Tarifa = {
    Id_Tarifa: '',
    Id_Hotel: '',
    Nombre_Hotel: '',
    Id_Tipo_Habitacion: '',
    Nombre_Tipo: '',
    Inicio: '',
    FechaInicio:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Fin: '',
    FechaFin:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Numero:'1',
    Tarifa : '',
    Moneda:''
  }

  ngOnInit() {
    this.cargarTarifasHabitacion();
    this.cargarHospedajes();
    this.cargarTipHabitacion();
  }
  async cargarTipHabitacion(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.tipoHabitacionService.cartarTipodeHabitacion(paginacion,'');
    if(data['total'] == 0){
      this.TipoHabitaciones = [];
    }else{
      this.TipoHabitaciones = data['data'];
    }
  }
  search(){
    this.cargarTarifasHabitacion(this.searchField);
  }
  searchHospedaje(){
    this.cargarHospedajes(this.searchFieldHospedaje);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.searchHospedaje();
    }
  }
  keytabHospedaje(event){
    if (event.key === 'Enter') {
      this.searchHospedaje();
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
    this.cargarTarifasHabitacion();
  }
  async cargarTarifasHabitacion(search?:any){
    let data = await this.tarifaHotelService.cartarTarifadeHabitacion(this.paginacion,search);
    if(data['total'] == 0){
      this.TarifasHabitacion = [];
    }else{
      this.TarifasHabitacion = data['data'];
    }
  }
  async editRecord(TarifaHabitacion){
    this.TarifaHabitacion = {
      Id_Tarifa_Habitacion:'',
      Nombre: ''
    }
    if(TarifaHabitacion){
      let data = await this.tarifaHotelService.cargarTarifa(TarifaHabitacion.Id_Tarifa);
      if(data['total']==1){
        this.Tarifa = data['data'][0];
        let fecha1Arr = data['data'][0]['Inicio'].split('/');
        this.Tarifa.FechaInicio = {
          month: parseInt(fecha1Arr[1]),
          day: parseInt(fecha1Arr[0]),
          year: parseInt(fecha1Arr[2]),
        }
        let fecha2Arr = data['data'][0]['Fin'].split('/');
        this.Tarifa.FechaFin = {
          month: parseInt(fecha2Arr[1]),
          day: parseInt(fecha2Arr[0]),
          year: parseInt(fecha2Arr[2]),
        }
      }
    }
    this.edit = true;
  }

  async grabar(){
    this.Tarifa.Inicio = this.Tarifa.FechaInicio.day + '/' + this.Tarifa.FechaInicio.month + '/' + this.Tarifa.FechaInicio.year;
    this.Tarifa.Fin = this.Tarifa.FechaFin.day + '/' + this.Tarifa.FechaFin.month + '/' + this.Tarifa.FechaFin.year;

    if(this.Tarifa.Id_Tarifa == ""){
      await this.tarifaHotelService.EditarTarifa(this.Tarifa);
    }else{
      await this.tarifaHotelService.NuevoTarifa(this.Tarifa);
    }
    this.cargarTarifasHabitacion();
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }

  abrirHospeajePanel(){
    this.HospedajePanel  = true;

  }
  selectHospedaje(Hospedaje){
    this.Tarifa.Id_Hotel = Hospedaje.Id_Hotel;
    this.Tarifa.Nombre_Hotel = Hospedaje.Nombre;
    this.closePanelHospedajes();
  }
  closePanelHospedajes(){
    this.HospedajePanel = false;
  }
  async cargarHospedajes(search?){
    let data = await this.hotelService.loadHotels(this.paginacion,search);
    if(data['total'] == 0){
      this.Hoteles = [];
    }else{
      this.Hoteles = data['data'];
    }
  }
}
