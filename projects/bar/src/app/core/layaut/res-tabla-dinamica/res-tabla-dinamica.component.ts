import { Component, OnInit } from '@angular/core';
import { ResTablaDinamicaService } from './res-tabla-dinamica.service';
import { PivotViewAllModule, PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview'
import { IDataOptions, IDataSet, PivotView, FieldListService } from '@syncfusion/ej2-angular-pivotview';

@Component({
  selector: 'app-res-tabla-dinamica',
  templateUrl: './res-tabla-dinamica.component.html',
  styleUrls: ['./res-tabla-dinamica.component.css'],
  providers: [FieldListService],
})
export class ResTablaDinamicaComponent implements OnInit {
  public pivotSettings: any;
  constructor(
    private resTablaDinamicaService:ResTablaDinamicaService
  ) { }
  
  ngOnInit() {
    this.leerCuboVentas();
  }

  async leerCuboVentas(){
    let data = await this.resTablaDinamicaService.leerCuboVentas();
    this.pivotSettings = {
      dataSource: data['data'], // Datos obtenidos del API
      rows: [
        { name: 'Anio', caption: 'Año' },
        { name: 'Categoria'}
      ],
      columns: [
        { name: 'Mes',customSort: (a, b) => parseInt(a.Mes, 10) - parseInt(b.Mes, 10)} // Nombre de la categoría
      ],
      values: [
        { name: 'Total_Ventas', caption: 'Ventas' }
      ],
      formatSettings: [{ name: 'Total_Ventas', format: 'N0' }],
      filters: [
        { name: 'Anio' }
      ],
      enableSorting: true
    };
  }
}
