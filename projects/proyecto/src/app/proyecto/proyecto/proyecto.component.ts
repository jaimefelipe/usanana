import { Component,OnInit,EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrl: './proyecto.component.css'
})
export class ProyectoComponent {
  ItemSelected = new EventEmitter<any>();
  AddItem = new EventEmitter<any>();
  UpdateItem = new EventEmitter<any>();

  GeneralTabActivo = true;
  CalendarioTabActive = false;
  GeneralClass = 'text-success tablinks active';
  CalendarioClass = '';

  OnInit(){
   
  }

  activarGeneralTab(){
    this.GeneralTabActivo = true;
    this.CalendarioTabActive = false;
    this.GeneralClass = 'text-success tablinks active';
    this.CalendarioClass = '';
  }
  activarCalendarioTab(){
    this.GeneralTabActivo = false;
    this.CalendarioTabActive = true;
    this.GeneralClass = '';
    this.CalendarioClass = 'text-success tablinks active';
  }

  ItemSelection(item){
    this.ItemSelected.emit(item.value); 
  }
  NewItem(Item){
    this.AddItem.emit(Item);
  }
  updateItem(Item){
    this.UpdateItem.emit(Item);
  }
}
