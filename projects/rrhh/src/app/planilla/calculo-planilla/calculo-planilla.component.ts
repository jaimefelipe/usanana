import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calculo-planilla',
  templateUrl: './calculo-planilla.component.html',
  styleUrls: ['./calculo-planilla.component.css']
})
export class CalculoPlanillaComponent implements OnInit {
  @Input() Planilla : any;
  constructor() { }

  ngOnInit() {
  }

}
