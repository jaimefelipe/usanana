import { Component, OnInit,Input  } from '@angular/core';

@Component({
  selector: 'app-recurso-texto',
  templateUrl: './recurso-texto.component.html',
  styleUrls: ['./recurso-texto.component.css']
})
export class RecursoTextoComponent implements OnInit {
  @Input() item: any;
  constructor() { }

  ngOnInit() {
  }

}
