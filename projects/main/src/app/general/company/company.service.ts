import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService) {}

  async loadCompanies() {
    let sqlConfig = {
      table: 'Gen_Empresa',
      fields: 'Id_Empresa,Nombre',
      orderField: '',
      simple:true,
      Empresa:false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadFooterIndicator(Id_Empresa){
    let sql = "SELECT Show_Footer from Gen_Empresa Where Id_Empresa = " + Id_Empresa;
    return await this.apiService.postRecord(sql);
  }
  async loadHomeMenuIndicator(Id_Empresa){
    let sql = "SELECT Show_Home_Menu from Gen_Empresa Where Id_Empresa = " + Id_Empresa;
    return await this.apiService.postRecord(sql);
  }
  async loadCompanyName(Id_Empresa){
    let sql = "SELECT Razon_Social from Gen_Empresa Where Id_Empresa = " + Id_Empresa;
    return await this.apiService.postRecord(sql);
  }
}
