import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { FullComponent } from './layaut/full/full.component';
import { NovedadesComponent } from './novedades/novedades.component';



@NgModule({
  declarations: [MenuComponent,FullComponent,NovedadesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }
