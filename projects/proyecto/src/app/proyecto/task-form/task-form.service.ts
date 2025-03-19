import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskFormService {

constructor(private apiService: ApiService) {}

async leerProyecto(Id_Proyecto){
  let sqlConfig = {
    table: 'Pro_Proyecto',
    fields: 'Id_Proyecto,Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin,Estado,Miembros,Prioridad,Progreso,Responsable,Inicio_Planificado,Fin_Planificado,Duracion_Estimada,Tiempo_Real,Cliente,ClienteNombre,Responsable,ResponsableNombre,Supervidor,SupervidorNombre,Colaborador,ColaboradorNombre,Patrocinador,PatrocinadorNombre,Promotor,PromotorNombre,Interesado,InteresadoNombre',
    where:"Id_Proyecto = " + Id_Proyecto
  }
  return await this.apiService.executeSqlSyn(sqlConfig,2);

}
async newProyecto(Proyecto){
  let sql = {
    table: 'Pro_Proyecto',
    fields: 'Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin,Estado,Miembros,Prioridad,Progreso,Inicio_Planificado,Fin_Planificado,Duracion_Estimada,Tiempo_Real,Cliente,ClienteNombre,Responsable,ResponsableNombre,Supervidor,SupervidorNombre,Colaborador,ColaboradorNombre,Patrocinador,PatrocinadorNombre,Promotor,PromotorNombre,Interesado,InteresadoNombre',
    values: '\'' + Proyecto.Tipo
    + '\',\'' + Proyecto.Nivel
    + '\',\'' + Proyecto.Codigo
    + '\',\'' + Proyecto.Padre
    + '\',\'' + Proyecto.Nombre
    + '\',\'' + Proyecto.Descripcion
    + '\',\'' + Proyecto.Objetivo
    + '\',\'' + Proyecto.Alcance
    + '\',\'' + Proyecto.Restricciones
    + '\',\'' + Proyecto.Inicio
    + '\',\'' + Proyecto.Fin
    + '\',\'' + Proyecto.Estado
    + '\',\'' + Proyecto.Miembros
    + '\',\'' + Proyecto.Prioridad
    + '\',\'' + Proyecto.Progreso
    + '\',\'' + Proyecto.Inicio_Planificado
    + '\',\'' + Proyecto.Fin_Planificado
    + '\',\'' + Proyecto.Duracion_Estimada
    + '\',\'' + Proyecto.Tiempo_Real
    + '\',\'' + Proyecto.Cliente
    + '\',\'' + Proyecto.ClienteNombre
    + '\',\'' + Proyecto.Responsable
    + '\',\'' + Proyecto.ResponsableNombre
    + '\',\'' + Proyecto.Supervidor
    + '\',\'' + Proyecto.SupervidorNombre
    + '\',\'' + Proyecto.Colaborador
    + '\',\'' + Proyecto.ColaboradorNombre
    + '\',\'' + Proyecto.Patrocinador
    + '\',\'' + Proyecto.PatrocinadorNombre
    + '\',\'' + Proyecto.Promotor
    + '\',\'' + Proyecto.PromotorNombre
    + '\',\'' + Proyecto.Interesado
    + '\',\'' + Proyecto.InteresadoNombre
    + '\''
  };
  return await this.apiService.insertRecord(sql);
}
async updateProyecto(Proyecto){
  let sql = {
    table: 'Pro_Proyecto',
    fields: 'Tipo=\'' + Proyecto.Tipo
    + '\',Nivel=\'' + Proyecto.Nivel
    + '\',Codigo=\'' + Proyecto.Codigo
    + '\',Padre=\'' + Proyecto.Padre
    + '\',Nombre=\''+ Proyecto.Nombre
    + '\',Descripcion=\''+ Proyecto.Descripcion
    + '\',Objetivo=\''+ Proyecto.Objetivo
    + '\',Alcance=\''+ Proyecto.Alcance
    + '\',Restricciones=\''+ Proyecto.Restricciones
    + '\',Inicio=\''+ Proyecto.Inicio
    + '\',Fin=\''+ Proyecto.Fin
    + '\',Estado=\''+ Proyecto.Estado
    + '\',Miembros=\''+ Proyecto.Miembros
    + '\',Prioridad=\''+ Proyecto.Prioridad
    + '\',Progreso=\''+ Proyecto.Progreso
    + '\',Inicio_Planificado=\''+ Proyecto.Inicio_Planificado
    + '\',Fin_Planificado=\''+ Proyecto.Fin_Planificado
    + '\',Duracion_Estimada=\''+ Proyecto.Duracion_Estimada
    + '\',Cliente=\''+ Proyecto.Cliente
    + '\',Tiempo_Real=\''+ Proyecto.Tiempo_Real
    + '\',ClienteNombre=\''+ Proyecto.ClienteNombre
    + '\',Responsable=\''+ Proyecto.Responsable
    + '\',ResponsableNombre=\''+ Proyecto.ResponsableNombre
    + '\',Supervidor=\''+ Proyecto.Supervidor
    + '\',SupervidorNombre=\''+ Proyecto.SupervidorNombre
    + '\',Colaborador=\''+ Proyecto.Colaborador
    + '\',ColaboradorNombre=\''+ Proyecto.ColaboradorNombre
    + '\',Patrocinador=\''+ Proyecto.Patrocinador
    + '\',PatrocinadorNombre=\''+ Proyecto.PatrocinadorNombre
    + '\',Promotor=\''+ Proyecto.Promotor
    + '\',PromotorNombre=\''+ Proyecto.PromotorNombre
    + '\',Interesado=\''+ Proyecto.Interesado
    + '\',InteresadoNombre=\''+ Proyecto.InteresadoNombre
    + '\'',
    where: 'Id_Proyecto=' + Proyecto.Id_Proyecto
  };
  return await this.apiService.updateRecord(sql,2);
}

async getLastProyectId(Id_Proyecto){
  let where = "p.Id_Proyecto = '"+ Id_Proyecto+ "'"
  if(Id_Proyecto ==''){
    where = "p.Padre = '' and p.Id_Empresa = "+localStorage.getItem('Id_Empresa');
  }
  //Obtener el Id del ultimo registro
  let sqlConfig = {
    table: 'Pro_Proyecto p',
    fields: 'p.Id_Proyecto,p.Codigo,p.Padre,(SELECT COUNT(*) FROM Pro_Proyecto WHERE Padre = p.Codigo) AS Cantidad_Subproyectos ',
    Empresa:false,
    where: where
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}

async AsignarMiembro(Id_Proyecto,Id_Persona){
  let sql = {
    table: 'Pro_Miembro',
    fields: 'Id_Proyecto,Id_Persona',
    values: '\'' + Id_Proyecto
    + '\',\'' + Id_Persona
    + '\''
  };
  return await this.apiService.insertRecord(sql);
}
async DesasignarMiembro(Id_Proyecto,Id_Persona){
  let sql = "Delete from Pro_Miembro where Id_Proyecto = "+Id_Proyecto + " and Id_Persona = "+ Id_Persona;
  return await this.apiService.postRecord(sql);
}
async leerMiembros(Id_Proyecto){
  let sqlConfig = {
    table: 'Pro_Miembro inner join Gen_Persona on Pro_Miembro.Id_Persona = Gen_Persona.Id_Persona',
    fields: 'Id_Miembro,Id_Proyecto,Pro_Miembro.Id_Persona,Nombre',
    where:"Id_Proyecto = " + Id_Proyecto
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}
async nuevaNota(Nota){
  let sql = {
    table: 'Pro_Nota',
    fields: 'Id_Proyecto,Id_Persona,Nota',
    values: '\'' + Nota.Id_Proyecto
    + '\',\'' + Nota.Id_Persona
    + '\',\'' + Nota.Nota
    + '\''
  };
  return await this.apiService.insertRecord(sql);
}
async leerNotas(Id_Proyecto){
  let sqlConfig = {
    table: 'Pro_Nota inner join Gen_Persona on Pro_Nota.Id_Persona = Gen_Persona.Id_Persona',
    fields: 'Id_Nota,Id_Proyecto,Pro_Nota.Id_Persona,Nombre,Nota,Pro_Nota.Creado_El as Fecha',
    where:"Id_Proyecto = " + Id_Proyecto
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}

}
