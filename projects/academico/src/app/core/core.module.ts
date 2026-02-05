import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { FullComponent } from './layaut/full/full.component';

@NgModule({
  declarations: [MenuComponent, FullComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }
