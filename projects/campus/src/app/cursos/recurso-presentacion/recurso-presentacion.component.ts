import { Component, OnInit,Input  } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-recurso-presentacion',
  templateUrl: './recurso-presentacion.component.html',
  styleUrls: ['./recurso-presentacion.component.css']
})
export class RecursoPresentacionComponent implements OnInit {
  @Input() item: any;
  constructor(private sanitizer: DomSanitizer) {}
  ngOnInit() {
  }
  esPowerPoint(url: string): boolean {
    return url?.toLowerCase().endsWith('.ppt') || url?.toLowerCase().endsWith('.pptx');
  }

  getOfficeEmbedUrl(url: string): SafeResourceUrl {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent("https://usantana.com/"+url)}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(officeUrl);
  }
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://usantana.com/"+ url);
  }
}
