import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Salvatec CMS';
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
