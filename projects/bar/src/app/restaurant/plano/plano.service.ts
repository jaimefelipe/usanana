import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  constructor(private apiService: ApiService) {}

  async loadPlaces(Id_Zona) {
    let where = ''
    if(Id_Zona != 99){
      where = 'Res_Mesa.Id_Zona =' + Id_Zona;
    }
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    let sqlConfig = {
      //table: 'Res_Mesa inner Join Res_Zona on Res_Mesa.Id_Zona = Res_Zona.Id_Zona left join (Select Id_Mesa, Nombre From Res_Pedido where Id_Empresa = ' + Id_Empresa +' and Estado = 1) as Pedido on Res_Mesa.Id_Mesa = Pedido.Id_Mesa',
      table: 'Res_Mesa inner Join Res_Zona on Res_Mesa.Id_Zona = Res_Zona.Id_Zona left join (Select Id_Mesa, Nombre From Res_Pedido where Id_Empresa = ' + Id_Empresa +' and Estado = 1) as Pedido on Res_Mesa.Id_Mesa = Pedido.Id_Mesa',
      fields: 'Res_Mesa.Id_Mesa,Res_Mesa.Nombre,Res_Mesa.Estado,Res_Zona.Nombre as Zona,Res_Mesa.Id_Zona, Arriba,Derecha,IFNULL(Tipo,1) as Tipo, Pedido.Nombre as Cliente,Res_Zona.Servicio',
      orderField: 'Nombre',
      simple:true,
      where: where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerCuentasMesa(Id_Mesa){
    let sqlConfig = {
      table: 'Res_Pedido',
      fields: 'Id_Pedido,Nombre,Id_Zona,Numero,Servicio',
      orderField: '',
      where:'Estado != 3  and Id_Mesa = ' + Id_Mesa
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async NuevaCuenta(Cuenta){
    let sql = {
      table: 'Res_Pedido',
      fields: 'Id_Mesa,Id_Zona,Id_Caja,Nombre,Servicio,Estado',
      values: '\'' + Cuenta.Id_Mesa
      + '\',\'' + Cuenta.Id_Zona
      + '\',\'' + Cuenta.Id_Caja
      + '\',\'' + Cuenta.Nombre
      + '\',\'' + Cuenta.Servicio
      + '\',\'' + Cuenta.Estado + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async ActualizarDatosPedido(Pedido){
    if(parseFloat(Pedido.Monto_Pagado) > parseFloat(Pedido.Total)){
      Pedido.Monto_Pagado = Pedido.Total;
    }else{
      if((parseFloat(Pedido.Monto_Pagado)+ parseFloat(Pedido.Monto_Pagado2)> parseFloat(Pedido.Total))){
        Pedido.Monto_Pagado2 = Pedido.Total - Pedido.Monto_Pagado;
      }else{
        if((parseFloat(Pedido.Monto_Pagado) + parseFloat(Pedido.Monto_Pagado2) + parseFloat(Pedido.Monto_Pagado3) )> parseFloat(Pedido.Total)){
          Pedido.Monto_Pagado3 = Pedido.Total - (Pedido.Monto_Pagado + Pedido.Monto_Pagado2);
        }
      }
    }
    let sql = "Update Res_Pedido set Estado = 3,Total="+Pedido.Total+", Nombre = '" + Pedido.Nombre
    + "',Metodo_Pago = '"+Pedido.Metodo_Pago
    + "',Monto_Pagado='"+Pedido.Monto_Pagado
    + "',Metodo_Pago2 ='"+Pedido.Metodo_Pago1
    + "',Monto_Pagado2='"+Pedido.Monto_Pagado2
    + "',Metodo_Pago3 ='"+Pedido.Metodo_Pago2
    + "',Monto_Pagado3='"+Pedido.Monto_Pagado3
    + "',Referencia1='"+Pedido.Referencia
    + "',Referencia2='"+Pedido.Referencia2
    + "',Referencia3='"+Pedido.Referencia3
    + "',Monto_Servicio='"+Pedido.Monto_Servicio
    + "',Facturado_Por='"+localStorage.getItem('Nombre_Usuario')+"' where Id_Pedido = " + Pedido.Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  async ActualizarIdClientePedido(Id_Pedido,Id_Cliente){
    let sql = "Update Res_Pedido set Id_Persona ="+Id_Cliente+" where Id_Pedido = " + Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  async ActualizarDatosPedidoDetalle(Detalle){
    let sql = `Update Res_Pedido_Detalle Set
    Cantidad =`+Detalle.Cantidad
    + `,Sub_Total = `+Detalle.Sub_Total
    + `,IVA = `+Detalle.IVA
    + `,Total = `+Detalle.Total
    +` where Id_Pedido_Detalle=`+Detalle.Id_Pedido_Detalle;
    await this.apiService.postRecord(sql);

  }
  async actualizarComanda(Id_Pedido){
    let sql = "Update Res_Pedido_Detalle set Comandado = Cantidad where Id_Pedido = "+Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  async CambiarIdPedido(Id_Nuevo_Pedido,Id_Pedido_Anterior){
    let sql = "Update Res_Pedido_Detalle Set Id_Pedido="+Id_Nuevo_Pedido+" where Id_Pedido="+Id_Pedido_Anterior;
    await this.apiService.postRecord(sql);
    //sql = "Update Res_Pedido set Estado = 3 where Id_Pedido="+Id_Pedido;
    //return await this.apiService.postRecord(sql);
  }
  async carcarScript(url,Id){
    return await this.apiService.postScript(url,Id);
  }

  async InsertLog(Log){
    // Acción
    // 1. Crear Cuenta.
    // 2. Sumar un artículo.
    // 3. Restar un artículo.
    // 4. Cerrar Pedido.
    // 5. Imprimir Cuenta.
    // 6. Imprimir Comanda.
    // 7. Facturar.
    // 8. Cambio de precio
    // 9. Agregar Artículo
    if(Log.Usuario == ''){
      Log.Usuario = localStorage.getItem('Nombre_Usuario');
    }
    let sql = {
      table: 'Res_Log',
      fields: 'Usuario,Accion,Cantidad,Id_Pedido,Id_Pedido_Detalle,Id_Producto',
      values: '\'' + Log.Usuario
      + '\',\'' + Log.Accion
      + '\',\'' + Log.Cantidad
      + '\',\'' + Log.Id_Pedido
      + '\',\'' + Log.Id_Pedido_Detalle
      + '\',\'' + Log.Id_Producto + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async actualizarCajaPedido(Caja){
    let sql = "Update Res_Pedido set Id_Caja = "+Caja.Id_Caja+",Id_Caja_Diaria="+Caja.Id_Caja_Diaria+" where Id_Pedido = "+Caja.Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  async agregarNota(Articulo){
    let sql = "Update Res_Pedido_Detalle set Notas = '" + Articulo.Notas + "' where Id_Pedido_Detalle = "+Articulo.Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  async ponerACeroTodo(Id_Pedido){
    let sql = "Update Res_Pedido_Detalle set Cantidad = 0, IVA = 0,Sub_Total = 0,Total = 0 where Id_Pedido = "+Id_Pedido;
    this.apiService.postRecord(sql);
    let sql1 = "Update Res_Pedido set Estado  = 3 where Id_Pedido = "+Id_Pedido;
    return await this.apiService.postRecord(sql1);
  }
  async actualizarSaldoCaja(Total_Pedido){
    let sql = "Update Ven_Caja set Saldo_Actual = Saldo_Actual + " +  Total_Pedido + " where Id_Caja = " + localStorage.getItem("Id_Caja");
    return await this.apiService.postRecord(sql);
  }

  async LoadInvoicePrinter(){
    let sql = "Select Valor From Gen_Parametros_Compania where Parametro = 'Bar_Invoice_Printer' and  Id_Empresa = "+ localStorage.getItem('Id_Empresa') +";";
    return await this.apiService.postRecord(sql);
  }
  async LoadKitchenPrinter(){
    let sql = "Select Valor From Gen_Parametros_Compania where Parametro = 'Bar_kitchen_Printer' and  Id_Empresa = "+ localStorage.getItem('Id_Empresa') +";";
    return await this.apiService.postRecord(sql);
  }
} 

