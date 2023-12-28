import { Component, OnInit } from '@angular/core';
import { InventoryMovementDetailService } from './inventory-movement-detail.service';

@Component({
  selector: 'app-inventory-movement-detail',
  templateUrl: './inventory-movement-detail.component.html',
  styleUrls: ['./inventory-movement-detail.component.css']
})
export class InventoryMovementDetailComponent implements OnInit {

  constructor(
    private inventoryMovementDetailService:InventoryMovementDetailService
  ) { }
  Details = [];
  searchField = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  ngOnInit(): void {
    this.loadDetails();
  }
  search() {
    this.loadDetails(this.searchField);
  }
  keytab(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }
  async loadDetails(search?){
    let data = await this.inventoryMovementDetailService.loadMovementDetails(this.paginacion,search);
    if (data["total"] == 0) {
      this.Details = [];
    } else {
      this.Details = data["data"];
    }
  }
  ChangePage(action) {
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow = this.paginacion.FirstRow - 50;
        this.paginacion.LastRow = this.paginacion.LastRow - 50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow + 50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadDetails(this.searchField);
  }

}
