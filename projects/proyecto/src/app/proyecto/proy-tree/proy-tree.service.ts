import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyTreeService {

  constructor(private apiService: ApiService) {}
  
  async cargarProyectos(paginacion:any,search?:any) {
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto,Codigo,Padre,Nombre',
      searchField: search,
      paginacion: paginacion,
      simple:true
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
