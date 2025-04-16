import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskKanbanService {

  constructor(private apiService: ApiService) {}

  async leerProyectosHijos(Id_Proyecto?) {
    let idEmpresa = localStorage.getItem("Id_Empresa");
    let idUsuario = localStorage.getItem("Id_Usuario");

    let sql = `CALL pro_Obtener_Proyectos_Hijos(${Id_Proyecto}, ${idEmpresa}, ${idUsuario})`;
    return await this.apiService.postRecord(sql);
}
  async updateProyectStatus(Id_Proyecto,Estado){
    let hoy = new Date();
    let Fecha =  {
      month: hoy.getMonth() + 1,
      day: hoy.getDate(),
      year: hoy.getFullYear()
    }
    let campo = '';
    if(Estado == '2'){
      //Actualizar fecha de inicio 
      let Inicio = Fecha.year + '-' + Fecha.month + '-' + Fecha.day + ' ' + hoy.getHours() + ":" + hoy.getMinutes();
      campo = "\',Inicio=\'"+Inicio;
    }
    if(Estado == '6'){
      //Actualizar fecha de inicio Fin
      let Fin = Fecha.year + '-' + Fecha.month + '-' + Fecha.day + ' ' + hoy.getHours() + ":" + hoy.getMinutes();
      campo = "\',Fin=\'"+Fin;
    }
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Estado=\'' + Estado + campo
      + '\'',
      where: 'Id_Proyecto=' + Id_Proyecto
    };
    let respuesta = await this.apiService.updateRecord(sql,2);
    if(Estado == '6'){
      await this.updateProyectTime(Id_Proyecto);
    }
    return respuesta;
  }
  async updateProyectTime(Id_Proyecto){
    let sql = "Select Inicio,Fin From Pro_Proyecto where Id_Proyecto ="+Id_Proyecto;
    let data = await this.apiService.postRecord(sql);

    let registros = data['data'];
    let Tiempo_Real = '';
    registros.forEach(registro => {
      const fechaInicioArray = registro.Inicio.split(/[- :]/).map(Number);
      const fechaFinArray = registro.Fin.split(/[- :]/).map(Number);
    
      const fechaInicio = new Date(
        fechaInicioArray[0], 
        fechaInicioArray[1] - 1, 
        fechaInicioArray[2], 
        fechaInicioArray[3], 
        fechaInicioArray[4], 
        fechaInicioArray[5]
      );
    
      const fechaFin = new Date(
        fechaFinArray[0], 
        fechaFinArray[1] - 1, 
        fechaFinArray[2], 
        fechaFinArray[3], 
        fechaFinArray[4], 
        fechaFinArray[5]
      );
    
      // Diferencia en milisegundos
      const diffMs = fechaFin.getTime() - fechaInicio.getTime();
    
      // Conversión a días, horas y minutos
      const totalMinutos = Math.floor(diffMs / 60000);
      const dias = Math.floor(totalMinutos / (24 * 60));
      const horas = Math.floor((totalMinutos % (24 * 60)) / 60);
      const minutos = totalMinutos % 60;
    
      // Guardar en formato días:horas:minutos
      Tiempo_Real = `${dias}:${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    });
    
    sql = "Update Pro_Proyecto set Tiempo_Real = '" + Tiempo_Real + "' where Id_Proyecto = "+ Id_Proyecto
    await this.apiService.postRecord(sql);
  }
}
