import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  constructor(private apiService: ApiService) {}
  
  async leerTransacciones(Usuario,Inicio,Fin) {
    let sqlConfig = {
      table: 'Ven_Cobros inner join Gen_Persona on Ven_Cobros.Id_Persona = Gen_Persona.Id_Persona inner Join Inv_Producto on Ven_Cobros.Id_Producto = Inv_Producto.Id_Producto',
      fields: 'Id_Cobro,Nombre,Descripcion, Monto, Ven_Cobros.Estado,Ven_Cobros.Creado_El',
      where: "Ven_Cobros.Creado_Por='" + Usuario + "' and Ven_Cobros.Creado_El >= '" +Inicio+"' and Ven_Cobros.Creado_El <='"+ Fin + "'"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async leerTotalTransacciones(Usuario,Inicio,Fin) {
    let sql = "SELECT sum(Monto) as Total FROM Ven_Cobros " +
    "WHERE (Ven_Cobros.Creado_Por='"+Usuario+"' and Ven_Cobros.Creado_El >= '"+Inicio+"' and Ven_Cobros.Creado_El <='"+Fin+"') " +
    "and  ( Ven_Cobros.Id_Empresa = 2150) and Estado = 3;"    
    return await this.apiService.postRecord(sql);
  }
}
