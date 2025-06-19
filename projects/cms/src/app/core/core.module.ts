import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { AppMenuSuperiorComponent } from './layaut/app-menu-superior/app-menu-superior.component';
import { AppMenuComponent } from './layaut/app-menu/app-menu.component';
import { FullComponent } from './layaut/full/full.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  declarations: [MenuComponent,AppMenuSuperiorComponent,AppMenuComponent,FullComponent],
  exports: [
      MenuComponent,
      AppMenuSuperiorComponent,
      AppMenuComponent
    ]
})
export class CoreModule { }
