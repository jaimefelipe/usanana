import { Component,OnInit  } from '@angular/core';
import { titleSettings } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
   title = 'rrhh';
    menuColapsado = false;
   isMobileView = false;
   
  ngOnInit() {
    this.detectarTamanioPantalla();

    window.addEventListener('resize', () => {
      this.detectarTamanioPantalla();
    });
  }

  detectarTamanioPantalla() {
    this.isMobileView = window.innerWidth < 768;
    if (this.isMobileView) {
      this.menuColapsado = true;
    }
  }

  toggleMenu() {
    this.menuColapsado = !this.menuColapsado;
  }

}
