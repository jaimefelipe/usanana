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

  ngOnInit(): void {
    setInterval(()=>{
      this.loadComandas();
    },515000);

    this.loadComandas();

  }
  async loadComandas(){
    let products = await this.restaurantKitchenService.loadComandas();
    console.log(products)
    if(products['total'] == 0){
      this.Comandas = [];
    }else{
      this.Comandas = products['data'];
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
