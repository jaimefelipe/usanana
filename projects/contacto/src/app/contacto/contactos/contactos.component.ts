import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {
  @Input() Persona : any;
  constructor() { }

  searchField= '';
  Contactos = [];
  ngOnInit(): void {
  }
  
  search(){}
  keytab(e){}
  abrirPantallaCarreraContacto(a){}

}
