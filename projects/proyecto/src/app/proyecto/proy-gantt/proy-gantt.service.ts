import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyGanttService {

  constructor(private apiService: ApiService) {}

  async leerItems(Id){
    let param = Id+'&e=' + localStorage.getItem('Id_Empresa');
    let data = await this.apiService.postScript('https://toxo.work/core/db/eps_leer_tareas_gantt.php',param);
    return data;
  }


}
