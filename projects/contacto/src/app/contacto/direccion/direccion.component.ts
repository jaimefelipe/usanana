import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent implements OnInit {
  @Input() Persona : any;
  @Input() Provinces : any;
  @Input() Cantons : any;
  @Input() Districts : any;
  @Output() provinceChange = new EventEmitter<string>();
  @Output() cantonChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  
  ProvinciaChange(){
    this.provinceChange.emit(this.Persona);
  }
  CantonChange(){
    this.cantonChange.emit(this.Persona);
  }
  

}
