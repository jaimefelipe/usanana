import { Component,OnInit,EventEmitter  } from '@angular/core';
import { ProyectoService } from './proyecto.service';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrl: './proyecto.component.css'
})
export class ProyectoComponent implements OnInit {
  constructor(
    private proyectoService:ProyectoService
) { }
  
  ItemSelected = new EventEmitter<any>();
  AddItem = new EventEmitter<any>();
  UpdateItem = new EventEmitter<any>();

  GeneralTabActivo = true;
  TableroTabActivo = false;
  CalendarioTabActive = false;
  GanttTabActive = false;

  GeneralClass = 'text-success tablinks active';
  TableroClass = "";
  CalendarioClass = '';
  GanttClass = "";
  

  ngOnInit(): void {
    this.cargarProyectos();
  }

  menuItems = [];

 


  activarGeneralTab(){
    this.GeneralTabActivo = true;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = false;
    this.GanttTabActive = false;
    this.GeneralClass = 'text-success tablinks active';
    this.TableroClass = "";
    this.CalendarioClass = '';
    this.GanttClass = "";
  }
  activarTableroTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = true;
    this.CalendarioTabActive = false;
    this.GanttTabActive = false;
    this.GeneralClass = "";
    this.TableroClass = 'text-success tablinks active';
    this.CalendarioClass = '';
    this.GanttClass = "";
  }
  activarCalendarioTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = true;
    this.GanttTabActive = false;
    this.GeneralClass = '';
    this.TableroClass = "";
    this.CalendarioClass = 'text-success tablinks active';
    this.GanttClass = "";
  }

  activarGanttTab(){
    this.GeneralTabActivo = false;
    this.TableroTabActivo = false;
    this.CalendarioTabActive = false;
    this.GanttTabActive = true;
    this.GeneralClass = '';
    this.TableroClass = "";
    this.CalendarioClass = '';
    this.GanttClass = 'text-success tablinks active';
  }
  

  /* Proyecto */
  async cargarProyectos(){
    let data = await this.proyectoService.cargarProyectos();
    this.menuItems = this.crearTree(data);
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

  /* Trabajo con los Items */
  seleccionarItem(item){
    item.collapse = !item.collapse;
    this.ItemSelected.emit(item.value); 
  }
  NewItem(Item){
    this.AddItem.emit(Item);
  }
  updateItem(Item){
    this.UpdateItem.emit(Item);
  }


}
