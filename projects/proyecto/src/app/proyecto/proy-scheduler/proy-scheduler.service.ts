import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProySchedulerService {

  constructor(private apiService: ApiService) {}

  async leerActividades(Id_Proyecto?,Inicio?,Fin?){
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: "Id_Proyecto,Nombre,Inicio,Fin,Descripcion,Miembros,Estado",
      where:" Nivel = 7 and Inicio >='" + Inicio + "' and Fin <= '"+Fin + "'"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
}
