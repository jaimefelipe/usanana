import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityAppService {

  constructor(private apiService: ApiService) {}

  async loadApps(paginacion,search?) {
    let sqlConfig = {
      table: 'App',
      fields: 'Id_App,Titulo,Principal,Estado',
      orderField: '',
      Empresa:false,
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
