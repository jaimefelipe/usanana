import { Component, OnInit, Input,Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-restaurant-order-child',
  templateUrl: './restaurant-order-child.component.html',
  styleUrls: ['./restaurant-order-child.component.css']
})
export class RestaurantOrderChildComponent implements OnInit {

  constructor() { }
  @Input() parentData;
  @Input("data") modifiedName;
  @Output() childToParent = new EventEmitter<String>();

  name:"brenes";
  
  ngOnInit(): void {

  }
  sendToParent(){
    this.childToParent.emit("Brenes");
  }
}
