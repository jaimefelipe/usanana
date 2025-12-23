import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiService: ApiService) { }
  async getUserCompany(email:string){
    let data:any;
    let sql = "select Gen_Empresa.Id_Empresa, Gen_Empresa.Nombre from Seg_Usuario_Empresa INNER JOIN Gen_Empresa ON Seg_Usuario_Empresa.Id_Empresa = Gen_Empresa.Id_Empresa INNER JOIN Seg_Usuario ON Seg_Usuario_Empresa.Id_Usuario = Seg_Usuario.Id_Usuario where Seg_Usuario_Empresa.estado = 1 and  Seg_Usuario.Correo = '" + email + "'";
    data = await this.apiService.postRecord(sql);
    return data;
  }
  async authenticateUser(reg:any){
    localStorage.clear();
    let email = reg.email;
    let company = reg.empresa;
    let clave = reg.password;
    let sqlUsuario = {
      table:'Seg_Usuario inner join Seg_Usuario_Empresa on Seg_Usuario.Id_Usuario = Seg_Usuario_Empresa.Id_Usuario inner join Gen_Empresa on Seg_Usuario_Empresa.Id_Empresa = Gen_Empresa.Id_Empresa',
      fields: 'Seg_Usuario.Tipo_Usuario,Seg_Usuario.Id_Usuario,Seg_Usuario.Nombre_Usuario,Seg_Usuario.Nombre,Master,Ventas,Compras,Inventario,CXC,CXP,CG,BA,Restaurante,Transporte,Seguridad,Hospedaje,Turismo,Gen_Empresa.Nombre as Empresa,Academico,Pov,Proyecto',
      where: '(Seg_Usuario.Estado = 1) AND (Seg_Usuario_Empresa.Estado = 1) AND  (Seg_Usuario.Clave = \'' + clave + '\')  and (Seg_Usuario.Correo = \'' + email + '\') and (Seg_Usuario_Empresa.Id_Empresa=\'' + company + '\' )',
      Empresa: false
    };
    let data = await this.apiService.executeSqlSyn(sqlUsuario);
    
    if(!data['total']) return false;
    if(data['total'] == 0){
      return false;
    }else{
      let user = data['data'];
      localStorage.setItem('Id_Empresa',company);
      localStorage.setItem('Id_Usuario',user[0].Id_Usuario.toString());
      localStorage.setItem('Nombre_Usuario',user[0].Nombre_Usuario.toString());
      localStorage.setItem('Nombre',user[0].Nombre.toString());
      localStorage.setItem('Empresa',user[0].Empresa.toString());
      localStorage.setItem('Version', '2.0.0.2');
      localStorage.setItem('ToxoMT', user[0].Master);
      localStorage.setItem('ToxoUT', user[0].Tipo_Usuario);
      localStorage.setItem('ToxoSG', user[0].Ventas + '.'+user[0].Compras + '.'+user[0].Inventario + '.'+user[0].CXC + '.'+user[0].CXP + '.'+user[0].CG + '.'+user[0].BA + '.'+user[0].Restaurante + '.'+user[0].Transporte + '.'+user[0].Seguridad + '.'+user[0].Hospedaje + '.'+user[0].Turismo + '.'+user[0].Academico + '.'+user[0].Pov+ '.'+user[0].Proyecto);
      localStorage.removeItem('Id_Caja');
      
      // obtener numero de caja abierta si es cajero
      let sqlCaja = {
        table:'Ven_Caja',
        fields:'Id_Caja',
        Empresa: true,
        where:'Estado = 1 and Id_Cajero =' + user[0].Id_Usuario
      }
      let dataCaja = await this.apiService.executeSqlSyn(sqlCaja);

      if(dataCaja['total'] > 0){
        localStorage.setItem('Id_Caja',dataCaja['data'][0]['Id_Caja']);
      }else{
        //Leer la ultima Caja ABierta no importa el usuario
        let sqlCaja = {
          table:'Ven_Caja',
          fields:'Id_Caja',
          Empresa: true,
          where:'Estado = 1 '
        }

        dataCaja = await this.apiService.executeSqlSyn(sqlCaja);
       
        localStorage.removeItem('Id_Caja');
      }

      // obtener la Caja Diaria ultima Caja que esta registrada.
      if(dataCaja['total'] > 0){
        let sqlCajaDiaria = {
          table:'Ven_Caja_Diaria',
          fields:'Id_Caja_Diaria',
          Empresa: true,
          where:"Estado = 1 and Id_Caja = " + dataCaja['data'][0]['Id_Caja'],
          orderDirection: ' DESC ',
          //+" and Id_Usuario ="+user[0].Id_Usuario
        }

        let dataCajaDiaria = await this.apiService.executeSqlSyn(sqlCajaDiaria);
        
        if(dataCajaDiaria['total'] > 0){
          localStorage.setItem('Id_Caja_Diaria',dataCajaDiaria['data'][0]['Id_Caja_Diaria']);
        }else{
          localStorage.removeItem('Id_Caja_Diaria');
        }
      }else{
        localStorage.removeItem('Id_Caja_Diaria');
      }

      this.apiService.postScript('https://usantana.com/core/php/hacienda2/consultar_hacienda.php',1);
      return true;
    }
  }
  
}
