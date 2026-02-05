import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SecurityModule,
    BibliotecaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
