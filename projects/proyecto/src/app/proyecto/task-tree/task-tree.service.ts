import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskTreeService {

constructor() { }
  async loadProyectos(){
  return await fetch(
    'https://toxo.work/reportes/proyecto/proy_proyectos.php?sql=' + localStorage.getItem('Id_Empresa'))
    .then((response) => {
      if (!response.ok) {
        return JSON.parse('{success: "false",total: "0", eror:"Error desconocido"}');
        //throw new Error('HTTP error ' + response.status);
      }else{}
      return response.json();
    })
    .then((json) => {
      return json;
    })
    .catch(function () {
      return JSON.parse('{success: "false",total: "0", eror:"error en catch"}');
    });
}  



}
