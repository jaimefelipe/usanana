import { Component, OnInit,Input  } from '@angular/core';

@Component({
  selector: 'app-recurso-enlace',
  templateUrl: './recurso-enlace.component.html',
  styleUrls: ['./recurso-enlace.component.css']
})
export class RecursoEnlaceComponent implements OnInit {
   @Input() item: any;
  constructor() { }

  ngOnInit() {
  }

}
