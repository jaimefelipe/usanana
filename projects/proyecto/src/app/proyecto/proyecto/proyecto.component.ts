import { Component,OnInit,EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrl: './proyecto.component.css'
})
export class ProyectoComponent {
  ItemSelected = new EventEmitter<any>();
  AddItem = new EventEmitter<any>();

  OnInit(){
   
  }
  ItemSelection(item){
    this.ItemSelected.emit(item.value); 
  }
  NewItem(Item){
    this.AddItem.emit(Item);
  }
}
