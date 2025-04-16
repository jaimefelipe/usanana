import { Component, OnInit } from '@angular/core';
import { RestaurantKitchenService } from './restaurant-kitchen.service';
import { RestaurantOrderService } from '../restaurant-order/restaurant-order.service';

@Component({
  selector: 'app-restaurant-kitchen',
  templateUrl: './restaurant-kitchen.component.html',
  styleUrls: ['./restaurant-kitchen.component.css']
})
export class RestaurantKitchenComponent implements OnInit {

  constructor(
    private restaurantKitchenService:RestaurantKitchenService,
    private restaurantOrderService:RestaurantOrderService
  ) { }
  Comandas = [];
  ComandasAgrupadas = [];
  ngOnInit(): void {
    setInterval(()=>{
      this.loadComandas();
    },515000);

    this.loadComandas();

  }
  groupComandas() {
    const grouped = this.Comandas.reduce((acc, comanda) => {
      if (!acc[comanda.Id_Pedido]) {
        acc[comanda.Id_Pedido] = {
          Id_Pedido: comanda.Id_Pedido,
          Zona: comanda.Zona,
          Mesa: comanda.Mesa,
          Hora: comanda.Hora,
          Tiempo_Transcurrido_Minutos: comanda.Tiempo_Transcurrido_Minutos,
          detalles: []
        };
      }
      acc[comanda.Id_Pedido].detalles.push(comanda);
      return acc;
    }, {});
  
    this.ComandasAgrupadas = Object.values(grouped);
  }

  async loadComandas(){
    let products = await this.restaurantKitchenService.loadComandas();
    console.log(products)
    if(products['total'] == 0){
      this.Comandas = [];
    }else{
      this.Comandas = products['data'];
      this.groupComandas();
      let string = '';
      for (let Componente of this.Comandas){
        //let Componentes = await this.restaurantOrderService.loadPedidoDetalleAlterno(Componente.Id_Pedido_Detalle)
        let Componentes = await this.restaurantKitchenService.loadDetalles(Componente.Id_Pedido);
        if(Componentes['total'] != 0){
          string = '';
          for (let comp of Componentes['data']){
            string = string +  comp['Componente'] + ' ' + comp['Sub_Componente'] + ', '
          }
          Componente['Componente'] = string;
          Componente['Componentes'] = Componentes['data'];
        }
      }
    }
    console.log(this.Comandas)
  }
  async End(Comanda){
    let products = await this.restaurantKitchenService.endComanda(Comanda.Id_Pedido);
    this.loadComandas();
  }
}
