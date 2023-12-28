import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class InventoryMovementDetailService {
  constructor(private apiService: ApiService) {}
  async loadMovementDetails(paginacion,search?){
    let sqlConfig = {
      table: 'Inv_Movimiento_Detalle inner Join Inv_Movimiento on Inv_Movimiento_Detalle.Id_Movimiento = Inv_Movimiento.Id_Movimiento',
      fields: 'Id_Movimiento_Detalle,Inv_Movimiento_Detalle.SKU,Inv_Movimiento_Detalle.Id_Movimiento,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Inv_Movimiento_Detalle.Descuento,Detalle_Descuento,Tasa,Inv_Movimiento_Detalle.IVA,Inv_Movimiento_Detalle.Sub_Total,Inv_Movimiento_Detalle.Total,Inv_Movimiento.Tipo_Movimiento,Inv_Movimiento.Creado_El,Inv_Movimiento.Estado,Inv_Movimiento.Registro_Origen',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
