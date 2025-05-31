import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

constructor( private apiService:ApiService) { }

async leerSemanas(paginacion,search?,Estado?) {
  let estado = '';
  if(Estado == 1 || Estado == 0){
    estado = 'Estado ='+ Estado;
  }
  let sqlConfig = {
    table: 'Rhh_Semana_Roll',
    fields: 'Id_Semana_Roll,Anio,Mes,Semana,Estado',
    searchField: search,
    paginacion: paginacion,
    where:estado
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}

  async generarSemana(Semana){
    let data = await await this.apiService.postRecord('Call sp_Rhh_Crear_Semana(' + localStorage.getItem('Id_Empresa') + "," + Semana.Anio + ','+ Semana.Mes + ','+ Semana.Semana + ')' );
    // return data['Identity'];;
  }

  async leerEmpleadosSemana(paginacion,search?,Id_Semana_Roll?) {
      let sqlConfig = {
        table: 'Rhh_Empleado_Roll inner join Gen_Persona on Rhh_Empleado_Roll.Id_Persona = Gen_Persona.Id_Persona inner join Rhh_Roll on Rhh_Empleado_Roll.Id_Roll =Rhh_Roll.Id_ROll ',
        fields: 'Rhh_Empleado_Roll.Id_Empleado_Roll,Gen_Persona.Nombre,Rhh_Roll.Nombre as Roll,Rhh_Empleado_Roll.Lunes,Rhh_Empleado_Roll.Inicio_Lunes,Rhh_Empleado_Roll.Fin_Lunes, Rhh_Empleado_Roll.Martes, Rhh_Empleado_Roll.Inicio_Martes, Rhh_Empleado_Roll.Fin_Martes, Rhh_Empleado_Roll.Miercoles, Rhh_Empleado_Roll.Inicio_Miercoles, Rhh_Empleado_Roll.Fin_Miercoles, Rhh_Empleado_Roll.Jueves, Rhh_Empleado_Roll.Inicio_Jueves,Rhh_Empleado_Roll.Fin_Jueves, Rhh_Empleado_Roll.Fin_Jueves, Rhh_Empleado_Roll.Viernes,Rhh_Empleado_Roll.Inicio_Viernes,Rhh_Empleado_Roll.Fin_Viernes, Rhh_Empleado_Roll.Sabado, Rhh_Empleado_Roll.Inicio_Sabado, Rhh_Empleado_Roll.Fin_Sabado, Rhh_Empleado_Roll.Domingo, Rhh_Empleado_Roll.Inicio_Domingo, Rhh_Empleado_Roll.Fin_Domingo',
        searchField: search,
        paginacion: paginacion,
        where:'Id_Semana_Roll = ' + Id_Semana_Roll
      }
      return await this.apiService.executeSqlSyn(sqlConfig);
    }
    
  async editarEmpleadoRoll(Empleado){
    let sql = {
      table: 'Rhh_Empleado_Roll',
      fields: 'Lunes=\''+ Empleado.Lunes
      + '\',Inicio_Lunes=\''+ Empleado.Inicio_Lunes
      + '\',Fin_Lunes=\''+ Empleado.Fin_Lunes
      + '\',Martes=\''+ Empleado.Martes
      + '\',Inicio_Martes=\''+ Empleado.Inicio_Martes
      + '\',Fin_Martes=\''+ Empleado.Fin_Martes
      + '\',Miercoles=\''+ Empleado.Miercoles
      + '\',Inicio_Miercoles=\''+ Empleado.Inicio_Miercoles
      + '\',Fin_Miercoles=\''+ Empleado.Fin_Miercoles
      + '\',Jueves=\''+ Empleado.Jueves
      + '\',Inicio_Jueves=\''+ Empleado.Inicio_Jueves
      + '\',Fin_Jueves=\''+ Empleado.Fin_Jueves
      + '\',Viernes=\''+ Empleado.Viernes
      + '\',Inicio_Viernes=\''+ Empleado.Inicio_Viernes
      + '\',Fin_Viernes=\''+ Empleado.Fin_Viernes
      + '\',Sabado=\''+ Empleado.Sabado
      + '\',Inicio_Sabado=\''+ Empleado.Inicio_Sabado
      + '\',Fin_Sabado=\''+ Empleado.Fin_Sabado
      + '\',Domingo=\''+ Empleado.Domingo
      + '\',Inicio_Domingo=\''+ Empleado.Inicio_Domingo
      + '\',Fin_Domingo=\''+ Empleado.Fin_Domingo
       + '\'', 
      where: 'Id_Empleado_Roll =' + Empleado.Id_Empleado_Roll
    };
    return await this.apiService.updateRecord(sql);
  }

}
