import { Component,OnInit,EventEmitter  } from '@angular/core';
import { ProyectoService } from './proyecto.service';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrl: './proyecto.component.css',
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ProyectoComponent implements OnInit {
  constructor(
    private proyectoService:ProyectoService
) { }
  
  ItemSelected = new EventEmitter<any>();
  FechaInicioSelected = new EventEmitter<any>();
  FechaFinSelected = new EventEmitter<any>();
  AddItem = new EventEmitter<any>();
  UpdateItem = new EventEmitter<any>();

  TabSelected = new EventEmitter<any>();
  hoy = new Date();
  
  primerDiaDelMes = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaDelMes = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);

  GeneralTabActivo = true;
  TableroTabActivo = false;
  CalendarioTabActive = false;
  GanttTabActive = false;
  PantallaActividad = false;
  WeekTabActive = false;

  GeneralClass = 'text-success tablinks active';
  TableroClass = "";
  CalendarioClass = '';
  GanttClass = "";
  
  FechaInicio =  {
    month: this.primerDiaDelMes.getMonth() + 1,
    day: this.primerDiaDelMes.getDate(),
    year: this.primerDiaDelMes.getFullYear()
  }
  FechaFin =  {
    month: this.ultimoDiaDelMes.getMonth() + 1,
    day: this.ultimoDiaDelMes.getDate(),
    year: this.ultimoDiaDelMes.getFullYear()
  }

  //Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
  //Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;

  
  ngOnInit(): void {
    this.cargarProyectos();
    this.FechaInicioCambia();
    this.FechaFinCambia();
  }

  menuItems = [];

  activarGeneralTab(){
    this.GeneralTabActivo = true;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = false;
    this.GanttTabActive = false;
    this.WeekTabActive = false;
    this.GeneralClass = 'text-success tablinks active';
    this.TableroClass = "";
    this.CalendarioClass = '';
    this.GanttClass = "";
    this.SeleccionarTab(1);
  }
  activarTableroTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = true;
    this.CalendarioTabActive = false;
    this.GanttTabActive = false;
    this.WeekTabActive = false;
    this.GeneralClass = "";
    this.TableroClass = 'text-success tablinks active';
    this.CalendarioClass = '';
    this.GanttClass = "";
    this.SeleccionarTab(2);
  }
  activarWeekTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = false;
    this.WeekTabActive = true;
    this.GanttTabActive = false;
    this.GeneralClass = '';
    this.TableroClass = "";
    this.CalendarioClass = 'text-success tablinks active';
    this.GanttClass = "";
    this.SeleccionarTab(3); 
  }
  activarCalendarioTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = true;
    this.GanttTabActive = false;
    this.WeekTabActive = false;
    this.GeneralClass = '';
    this.TableroClass = "";
    this.CalendarioClass = 'text-success tablinks active';
    this.GanttClass = "";
    this.SeleccionarTab(4);
  }

  activarGanttTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = false;
    this.GanttTabActive = true;
    this.WeekTabActive = false;
    this.GeneralClass = '';
    this.TableroClass = "";
    this.CalendarioClass = '';
    this.GanttClass = 'text-success tablinks active';
    this.SeleccionarTab(5);
  }
  

  /* Proyecto */
  async cargarProyectos(){
    let data = await this.proyectoService.cargarProyectos();
    this.menuItems = this.crearTree(data);
    this.seleccionarItem(this.menuItems[0]);
  }

  crearTree(data){
    let source = {
        datatype: 'json',
        datafields: [
            { name: 'Id_Proyecto' },
            { name: 'Codigo' },
            { name: 'Nombre' },
            { name: 'Padre' },
            { name: 'rowid' }
        ],
        id: 'Codigo',
        localdata: data
    };
    let dataAdapter = new jqx.dataAdapter(source, { autoBind: true });
    let records =  dataAdapter.getRecordsHierarchy('Codigo', 'Padre', 'items', [{ name: 'Nombre', map: 'label'},{name:'Id_Proyecto',map:'value'}]);
    return records;
  }

  colapsarItem(item){
    item.collapse = !item.collapse;
  }
  /* Trabajo con los Items */
  seleccionarItem(item){
    
    //item.collapse = !item.collapse;
    this.ItemSelected.emit(item); 
    
  }
  findId(array: any[], targetId: number,Texto): any | null {
    for (let item of array) {
      if (item.Id_Proyecto === targetId) {
        item.Nombre = Texto;
        return item;
      }
      if (item.items.length > 0) {
        let found = this.findId(item.items, targetId, Texto);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }


  NewItem(Item){
    this.AddItem.emit(Item);
  }
  updateItem(Item){
    //this.UpdateItem.emit(Item);
    let result = this.findId(this.menuItems, Item.Id_Proyecto,Item.Nombre);

  }

  SeleccionarTab(Tab){
    this.FechaInicioCambia();
    this.FechaFinCambia();
    this.TabSelected.emit(Tab)
  }
  FechaInicioCambia(){
    //Cambiar fecha de Fin al ultimo dia del ments de la fecha de inicio
    let fechaSeleccionada = new Date(this.FechaInicio.year+'-'+this.FechaInicio.month+'-'+this.FechaInicio.day);
    let ultimoDiaDelMes = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() + 1, 0);
    this.FechaFin =  {
      month: ultimoDiaDelMes.getMonth() + 1,
      day: ultimoDiaDelMes.getDate(),
      year: ultimoDiaDelMes.getFullYear()
    }
    this.FechaInicioSelected.emit(this.FechaInicio);
  }
  FechaFinCambia(){
    this.FechaFinSelected.emit(this.FechaFin);
  }
  SeleccionarItem(item){
    item.value = item.Id_Proyecto;
    this.seleccionarItem(item);
    this.PantallaActividad=true;
  }
  cerrarMiembroPanel(){
    this.PantallaActividad = false;
  }
}

