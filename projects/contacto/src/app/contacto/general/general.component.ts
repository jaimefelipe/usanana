import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  @Input() Persona : any;
  @Input() edit:any;
  @Output() close = new EventEmitter<string>();

  
  constructor() { }

  ngOnInit(): void {
  }
  cancel(){
    this.close.emit(this.Persona);
  }
  grabar(){}
}
