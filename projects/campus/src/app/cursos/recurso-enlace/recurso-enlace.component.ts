import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-recurso-enlace',
  templateUrl: './recurso-enlace.component.html',
  styleUrls: ['./recurso-enlace.component.css']
})
export class RecursoEnlaceComponent implements OnInit {
  @Input() item: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  getRawContent(): string {
    return String(this.item?.Contenido || this.item?.URL || '').trim();
  }

  decodeHtmlEntities(value: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  extractUrl(value: string): string {
    const raw = this.decodeHtmlEntities(String(value || '').trim());
    if (!raw) {
      return '';
    }
    const iframeMatch = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1].trim();
    }
    const hrefMatch = raw.match(/<a[^>]+href=["']([^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1].trim();
    }
    return raw;
  }

  normalizeEmbedUrl(url: string): string {
    const clean = this.extractUrl(url);
    if (!clean) {
      return '';
    }
    if (/^https:\/\/www\.canva\.com\/design\/[^/]+\/[^/]+\/view/i.test(clean)) {
      return clean.includes('embed') ? clean : clean + (clean.includes('?') ? '&embed' : '?embed');
    }
    return clean;
  }

  getEmbedUrl(): SafeResourceUrl | null {
    const url = this.normalizeEmbedUrl(this.getRawContent());
    if (!this.isEmbeddable(url)) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getExternalUrl(): string {
    return this.extractUrl(this.getRawContent());
  }

  isEmbeddable(url: string): boolean {
    return /^https:\/\/www\.canva\.com\/design\/[^/]+\/[^/]+\/view/i.test(url)
      || /^https:\/\/[^/]*\.?canva\.com\//i.test(url)
      || /^https:\/\/docs\.google\.com\//i.test(url)
      || /^https:\/\/view\.officeapps\.live\.com\//i.test(url);
  }

}
