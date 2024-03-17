import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyTableroService {

  constructor(private apiService: ApiService) {}

  async leerItems(Id,Estado,Inicio,Fin){
    let param = Id+'&e=' + localStorage.getItem('Id_Empresa')+'&s='+Estado+'&i='+Inicio+'&f='+Fin;
    let data = await this.apiService.postScript('https://toxo.work/core/db/eps_leer_tareas.php',param);
    return data;
  }

  async CambiarEstadoTarea(Id_Proyecto,Estado){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Estado=\''+ Estado
      
      + '\'',
      where: 'Id_Proyecto=' + Id_Proyecto
    };
    return await this.apiService.updateRecord(sql);
  }
}
