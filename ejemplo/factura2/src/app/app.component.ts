import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'factura';
  menuColapsado = false;
  isMobileView = false;

  ngOnInit(): void {
    this.updateViewport();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  toggleMenu() {
    this.menuColapsado = !this.menuColapsado;
  }

  closeMenu() {
    if (!this.menuColapsado) {
      this.menuColapsado = true;
    }
  }

  private updateViewport(): void {
    const wasMobile = this.isMobileView;
    this.isMobileView = window.innerWidth < 992;
    if (this.isMobileView && !wasMobile) {
      this.menuColapsado = true;
    }
    if (!this.isMobileView && wasMobile) {
      this.menuColapsado = false;
    }
  }

}
