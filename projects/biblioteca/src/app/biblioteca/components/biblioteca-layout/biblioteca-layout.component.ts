import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

type SectionKey = 'operacion' | 'catalogacion' | 'circulacion' | 'seriales' | 'adquisiciones' | 'administracion' | 'integraciones' | 'opac' | 'general';

@Component({
  selector: 'app-biblioteca-layout',
  templateUrl: './biblioteca-layout.component.html',
  styleUrls: ['./biblioteca-layout.component.css']
})
export class BibliotecaLayoutComponent implements OnInit {
  menuColapsado = false;
  isMobileView = false;
  logedIn = false;
  Company = localStorage.getItem('Id_Empresa');
  User = localStorage.getItem('Nombre_Usuario');
  sectionState: Record<SectionKey, boolean> = {
    operacion: false,
    catalogacion: false,
    circulacion: false,
    seriales: false,
    adquisiciones: false,
    administracion: false,
    integraciones: false,
    opac: false,
    general: false
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.logedIn = localStorage.getItem('isLoggedin') === 'true';
    if (!this.logedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.updateViewport();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  toggleMenu(): void {
    this.menuColapsado = !this.menuColapsado;
  }

  closeMenu(): void {
    if (!this.menuColapsado) {
      this.menuColapsado = true;
    }
  }

  toggleSection(event: Event, key: SectionKey): void {
    event.preventDefault();
    this.sectionState[key] = !this.sectionState[key];
  }

  sectionChevron(key: SectionKey): string {
    return this.sectionState[key] ? 'v' : '>';
  }

  onNavClick(event: Event): void {
    if (!this.isMobileView) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const isToggle = target.closest('[data-toggle="menu"]');
    const link = target.closest('a');
    if (link && !isToggle) {
      this.toggleMenu();
    }
  }

  logOut(): void {
    localStorage.setItem('isLoggedin', 'false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    this.router.navigate(['/login']);
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
