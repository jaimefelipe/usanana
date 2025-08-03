import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recurso-video',
  templateUrl: './recurso-video.component.html',
  styleUrls: ['./recurso-video.component.css']
})
export class RecursoVideoComponent implements OnInit {
   @Input() item: any;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }
    getYoutubeEmbedUrl(url: string): any {
    const videoId = this.extractYoutubeId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
  extractYoutubeId(url: string): string {
    const match = url.match(/[?&]v=([^&#]*)/) || url.match(/youtu\.be\/([^&#]*)/);
    return match && match[1] ? match[1] : '';
  }
}
