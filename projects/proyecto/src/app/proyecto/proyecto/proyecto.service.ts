import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private apiService: ApiService) {}

  async cargarProyectos() {
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto,Codigo,Padre,Nombre',
      simple:true
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
