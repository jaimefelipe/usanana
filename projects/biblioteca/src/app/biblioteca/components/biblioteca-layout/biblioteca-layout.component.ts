import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RELEASES, VERSION_ACTUAL, Release } from '../../version';

type SectionKey = 'operacion' | 'catalogacion' | 'circulacion' | 'seriales' | 'adquisiciones' | 'administracion' | 'integraciones' | 'opac' | 'general';

const SECTION_STATE_STORAGE_KEY = 'biblioteca_section_state';

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
  appVersion = VERSION_ACTUAL.version;
  mostrarNovedades = false;
  releases: Release[] = [...RELEASES].reverse();
  sectionState: Record<SectionKey, boolean> = this.cargarSectionState();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.logedIn = localStorage.getItem('isLoggedin') === 'true';
    if (!this.logedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.updateViewport();
  }

  private cargarSectionState(): Record<SectionKey, boolean> {
    const estadoBase: Record<SectionKey, boolean> = {
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
    try {
      const guardado = sessionStorage.getItem(SECTION_STATE_STORAGE_KEY);
      if (guardado) {
        Object.assign(estadoBase, JSON.parse(guardado));
      }
    } catch {
      // Estado corrupto o sessionStorage no disponible: se usa el estado base.
    }
    return estadoBase;
  }

  private guardarSectionState(): void {
    try {
      sessionStorage.setItem(SECTION_STATE_STORAGE_KEY, JSON.stringify(this.sectionState));
    } catch {
      // sessionStorage no disponible: no persiste, pero no interrumpe la navegacion.
    }
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
    this.guardarSectionState();
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
