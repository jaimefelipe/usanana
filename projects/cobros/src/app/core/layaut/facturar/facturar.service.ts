import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturarService {

  constructor(private apiService: ApiService) {}

  async insertCobro(Cobro){
    let sql = {
      table: 'Ven_Cobros',
      fields: 'Id_Persona,Id_Producto,Monto,TC,Estado,Metodo_Cobro,Respuesta',
      values: '\'' + Cobro.Id_Persona
      + '\',\'' + Cobro.Id_Producto
      + '\',\'' + Cobro.Monto
      + '\',\'' + Cobro.TC
      + '\',\'' + 1
      + '\',\'' + Cobro.Metodo
      + '\',\'' + Cobro.Respuesta
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateCobro(Cobro){
    let sql = {
      table: 'Ven_Cobros',
      fields: 'respuesta=\'' + Cobro.transaccionId
      + '\',Estado=\'' + Cobro.Estado  + '\'',
      where: 'Id_Cobro=' + Cobro.Id_Cobro
    };
    return await this.apiService.updateRecord(sql);
  }

  async conexionCon4Geeks(reg){
    let url = 'https://toxo.work/core/lib/conexion4geeks.php'; 
    let data = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors', //no-cors,cors, *cors, same-origin
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: JSON.stringify({ reg: reg })
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        return JSON.parse('[{"success":"false","total":"0","Error":"error en catch"}]');
      });

    return data;
  }
  async updateUser(Id_Usuario){
    let sql = {
      table: 'Seg_Usuario',
      fields: 'Ventas=\'1\',Compras=\'1\',Inventario=\'1'
      + '\'',
      where: 'Id_Usuario=' + Id_Usuario
    };
    return await this.apiService.updateRecord(sql);
  }
}
