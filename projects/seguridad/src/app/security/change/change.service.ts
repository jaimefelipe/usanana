import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChangeService {

  constructor(private apiService: ApiService) { }
  async validatePassword(password){
    let data:any;
    let sql = "select Clave from Seg_Usuario where Id_Usuario = " + localStorage.getItem('Id_Usuario');
    data = await this.apiService.postRecord(sql);
    if(data['data'][0]['Clave'] == password){
      return true;
    }else{
      return false;
    }
  }
  async cambiarClave(password){
    let sql = "Update Seg_Usuario set Clave = '"+password+"' where Id_Usuario = " + localStorage.getItem('Id_Usuario');
    let data = await this.apiService.postRecord(sql);
    return true;
  }
}
