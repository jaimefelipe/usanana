import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-proy-tablero',
  templateUrl: './proy-tablero.component.html',
  styleUrls: ['./proy-tablero.component.css']
})
export class ProyTableroComponent implements OnInit {
  
  @Input() ItemSelected: EventEmitter<string>; 

  constructor() { }

  ngOnInit() {
    this.subscribeToParentEmitter(); 
  }
  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      alert('Input recibido en tablero' )
      
    }); 
  } 
}
