import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-order-main',
  templateUrl: './restaurant-order-main.component.html',
  styleUrls: ['./restaurant-order-main.component.css']
})
export class RestaurantOrderMainComponent implements OnInit {

  constructor() { }
  data = {
    Nombre: 'Jaime'
  }
  ngOnInit(): void {
  }
  childToParent(name){
    this.data.Nombre=name;
  }

}
