import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aula-virtual-general',
  templateUrl: './aula-virtual-general.component.html',
  styleUrls: ['./aula-virtual-general.component.css']
})
export class AulaVirtualGeneralComponent implements OnInit {

  @Input() Aula: any;
  @Input() Grupos: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
