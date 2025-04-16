import { Component, OnInit } from '@angular/core';
import { ResTablaDinamicaService } from './res-tabla-dinamica.service';
import { PivotViewAllModule, PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview'
import { IDataOptions, IDataSet, PivotView, FieldListService } from '@syncfusion/ej2-angular-pivotview';
import { ConditionalFormattingService } from '@syncfusion/ej2-angular-pivotview';

@Component({
  selector: 'app-res-tabla-dinamica',
  templateUrl: './res-tabla-dinamica.component.html',
  styleUrls: ['./res-tabla-dinamica.component.css'],
  providers: [FieldListService,ConditionalFormattingService],
})
export class ResTablaDinamicaComponent implements OnInit {
  public pivotSettings: any;
  public pivotTicetSetting:any
  constructor(
    private resTablaDinamicaService:ResTablaDinamicaService
  ) { }

  ngOnInit() {
   // this.leerCuboVentas();
    this.leerCuboTicketPromedio();
  }

  

  async leerCuboTicketPromedio() {
    let data = await this.resTablaDinamicaService.leerCuboTiquetePromedio();
    
    this.pivotTicetSetting = {
      dataSource: data['data'],
      rows: [
        { name: 'Anio', caption: 'Año' },
        { name: 'Categoria' }
      ],
      columns: [
        { name: 'Mes' }
      ],
      values: [
        { name: 'Total_Ventas', caption: 'Ventas' },
        {
          name: 'Ticket_Promedio',
          caption: 'Tiquete Promedio',
          type: 'Max' // ¡No usar 'Avg' porque ya viene calculado!
        },
        {
          name: 'Cantidad_Pedidos',
          caption: 'Pedidos',
          type: 'Sum'
        }
      ],
      formatSettings: [
        { name: 'Total_Ventas', format: 'N0' },
        { name: 'Ticket_Promedio', format: 'N0' },
        { name: 'Cantidad_Pedidos', format: 'N0' }
      ],
      filters: [
        { name: 'Anio' }
      ],
      enableSorting: true,
      conditionalFormatSettings: [
        {
          measure: 'Ticket_Promedio',
          value1: 0,
          conditions: 'NotEquals',
          style: {
            backgroundColor: '#E6F7FF', // Azul claro
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '12px'
          }
        },
        {
          measure: 'Cantidad_Pedidos',
          value1: 0,
          conditions: 'NotEquals',
          style: {
            backgroundColor: '#FFF2CC', // Amarillo claro
            color: '#000000',
            fontFamily: 'Arial',
            fontSize: '12px'
          }
        }
      ],
    };
  }

}
