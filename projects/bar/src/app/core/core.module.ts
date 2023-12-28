import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { MenuSuperiorComponent } from './layaut/menu-superior/menu-superior.component';

@NgModule({
  declarations: [MenuComponent,MenuSuperiorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  exports: [
    MenuComponent,
    MenuSuperiorComponent
  ]
})
export class CoreModule { }
